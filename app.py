from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime, date # Import date
import pandas as pd
import logging
import os  # osモジュールをインポート

app = Flask(__name__)

# --- 設定 ---
# 環境変数 DATABASE_URL があればそれを使い、なければSQLiteを使う
database_url = os.environ.get('DATABASE_URL')

if database_url and database_url.startswith('postgres://'):
    # RenderのPostgreSQLなど (postgres:// -> postgresql:// に置換)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url.replace('postgres://', 'postgresql://', 1)
elif database_url:
     # postgresql:// で始まるURLなど（そのまま使う）
     app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # ローカル開発用のSQLite設定
    # instanceフォルダを確実に使うように修正
    basedir = os.path.abspath(os.path.dirname(__file__))
    instance_path = os.path.join(basedir, 'instance')
    if not os.path.exists(instance_path):
        os.makedirs(instance_path)
    # データベースファイル名を適切に設定 (例: 'local_data.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'local_data.db')

# SQLALCHEMY_TRACK_MODIFICATIONS は非推奨なのでFalseのまま
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# SECRET_KEY は環境変数から取得、なければデフォルト値（開発用）
# Render側では必ず環境変数 SECRET_KEY を設定してください！
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a-very-secret-key-for-dev')

db = SQLAlchemy(app)
migrate = Migrate(app, db) # Migrateの初期化はdbの後

# --- ここまで ---

logging.basicConfig(level=logging.DEBUG)

class Employee(db.Model):
    __tablename__ = 'employees'
    employee_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    employee_number = db.Column(db.String(20))
    department = db.Column(db.String(50))
    position = db.Column(db.String(50))
    hire_date = db.Column(db.TEXT)
    okrs = db.relationship('Okr', lazy=True)

# --- Add Models for other tables ---
class Okr(db.Model):
    __tablename__ = 'okrs'
    okr_id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id', name='fk_okrs_employee_id'), nullable=False)
    objective = db.Column(db.String)
    key_result1 = db.Column(db.String)
    key_result1_progress = db.Column(db.Integer)
    key_result1_memo = db.Column(db.String)
    key_result2 = db.Column(db.String)
    key_result2_progress = db.Column(db.Integer)
    key_result2_memo = db.Column(db.String)
    key_result3 = db.Column(db.String)
    key_result3_progress = db.Column(db.Integer)
    key_result3_memo = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    employee = db.relationship('Employee', foreign_keys=[employee_id])

class OneOnOneRecord(db.Model):
    __tablename__ = 'one_on_one_records'
    record_id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id', name='fk_one_on_one_records_employee_id'), nullable=False)
    record_type = db.Column(db.String) # This seems to be the type of 1on1 record itself
    record_date = db.Column(db.Date)
    okr_progress = db.Column(db.String)
    competency_evaluation = db.Column(db.String)
    work_power_evaluation = db.Column(db.String)
    meeting_minutes = db.Column(db.String)
    feedback = db.Column(db.String)
    expert_content = db.Column(db.String)
    follow_up = db.Column(db.String)
    self_reflection = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    employee = db.relationship('Employee', foreign_keys=[employee_id])

class JobSkillLevel(db.Model):
    __tablename__ = 'job_skill_levels'
    level_id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id', name='fk_job_skill_levels_employee_id'), nullable=False)
    business = db.Column(db.String)
    business_unit = db.Column(db.String)
    difficulty = db.Column(db.Integer)
    beginner = db.Column(db.Integer)
    intermediate = db.Column(db.Integer)
    chief_or_above = db.Column(db.Integer)
    managerial_position = db.Column(db.Integer)
    required_skills = db.Column(db.String)
    acquisition_method = db.Column(db.String)
    evaluation_method = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    employee = db.relationship('Employee', foreign_keys=[employee_id])

class JobTaskList(db.Model):
    __tablename__ = 'job_task_lists'
    task_id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id', name='fk_job_task_lists_employee_id'), nullable=False)
    task_name = db.Column(db.String)
    task_details = db.Column(db.String)
    video_link = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    employee = db.relationship('Employee', foreign_keys=[employee_id])

class AiSupportRecord(db.Model):
    __tablename__ = 'ai_support_records'
    record_id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.employee_id', name='fk_ai_support_records_employee_id'), nullable=False)
    record_date = db.Column(db.Date)
    trend_analysis = db.Column(db.String)
    alert_message = db.Column(db.String)
    sentiment_analysis = db.Column(db.String)
    ai_chat_session = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    employee = db.relationship('Employee', foreign_keys=[employee_id])

# --- End of added models ---


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

class CompetencyItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    criteria = db.Column(db.String(255), nullable=False)
    coefficient = db.Column(db.Float, nullable=False)

class CompetencyEvaluation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('competency_item.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    improvement = db.Column(db.String(255), nullable=True)
    points = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('evaluations', lazy=True))
    item = db.relationship('CompetencyItem', backref=db.backref('evaluations', lazy=True))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/schedule')
def schedule():
    return render_template('schedule.html')

@app.route('/ask', methods=['POST'])
def ask_ai():
    user_question = request.json.get('question')
    answer = f"あなたの質問: '{user_question}' に対する回答は、これはAIの模擬返答です！"
    return jsonify({'answer': answer})

@app.route('/competencies')
def competencies():
    evaluations = CompetencyEvaluation.query.all()
    total_coefficient = sum(evaluation.item.coefficient for evaluation in evaluations)
    total_points = sum(evaluation.points for evaluation in evaluations if evaluation.points is not None)
    total_score = sum(evaluation.points for evaluation in evaluations if evaluation.points is not None)
    return render_template('competencies.html', evaluations=evaluations, total_coefficient=total_coefficient, total_points=total_points, total_score=total_score)

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file:
            df = pd.read_csv(file)
            logging.debug(f"CSVファイルの内容: {df.head()}")

            # 係数の合計を計算
            total_coefficient = df['係数'].sum()
            logging.debug(f"係数の合計: {total_coefficient}")
            if total_coefficient != 25:
                flash('係数の合計が25になるように調整してアップしてください。')
                return redirect(url_for('upload'))

            # 既存のデータを削除
            CompetencyEvaluation.query.delete()
            CompetencyItem.query.delete()
            User.query.delete()
            db.session.commit()

            for index, row in df.iterrows():
                logging.debug(f"処理中の行: {index}, 内容: {row}")
                if index >= 20 and (pd.isna(row['社員ID']) or pd.isna(row['評価カテゴリ']) or pd.isna(row['評価項目']) or pd.isna(row['評価基準']) or pd.isna(row['評価（5段階）']) or pd.isna(row['係数'])):
                    continue  # 通し番号が21以上で空白の場合はスキップ

                user_id = row['社員ID']
                item_category = row['評価カテゴリ']
                item_name = row['評価項目']
                criteria = row['評価基準']
                rating = row['評価（5段階）']
                improvement = row['強化する項目']
                coefficient = row['係数']

                # ユーザーの追加
                user = User.query.filter_by(id=user_id).first()
                if not user:
                    user = User(id=user_id, name=f'User {user_id}')
                    db.session.add(user)

                # 評価項目の追加
                item = CompetencyItem.query.filter_by(name=item_name).first()
                if not item:
                    item = CompetencyItem(category=item_category, name=item_name, criteria=criteria, coefficient=coefficient)
                    db.session.add(item)
                    db.session.flush()  # 追加: セッションをフラッシュしてitem.idを取得可能にする

                # 評価の追加（ポイントは空白）
                evaluation = CompetencyEvaluation(user_id=user_id, item_id=item.id, rating=rating, improvement=improvement, points=None)
                db.session.add(evaluation)

            db.session.commit()
            logging.debug("データベースにコミットしました。")
            return redirect(url_for('competencies'))
    return render_template('upload.html')

@app.route('/self_evaluation', methods=['GET', 'POST'])
def self_evaluation():
    if request.method == 'POST':
        for key, value in request.form.items():
            if key.startswith('rating_'):
                evaluation_id = key.split('_')[1]
                rating = int(value)
                evaluation = CompetencyEvaluation.query.get(evaluation_id)
                if evaluation:
                    evaluation.rating = rating
                    evaluation.points = rating * evaluation.item.coefficient
        db.session.commit()
        return redirect(url_for('self_evaluation'))

    evaluations = CompetencyEvaluation.query.all()
    total_coefficient = sum(evaluation.item.coefficient for evaluation in evaluations)
    total_points = sum(evaluation.points for evaluation in evaluations if evaluation.points is not None)
    total_score = sum(evaluation.points for evaluation in evaluations if evaluation.points is not None)
    return render_template('self_evaluation.html', evaluations=evaluations, total_coefficient=total_coefficient, total_points=total_points, total_score=total_score)

@app.route('/admin_dashboard')
def admin_dashboard():
    return render_template('admin_dashboard.html')

@app.route('/yogo')
def yogo():
    return render_template('yogo.html')

@app.route('/job_task_list')
def job_task_list():
    return render_template('job_task_list.html')

@app.route('/okr')
def okr():
    return render_template('okr.html')

@app.route('/admin_okr')
def admin_okr():
    return render_template('admin-okr.html')

@app.route('/level01')
def level01():
    return render_template('level01.html')

@app.route('/level02')
def level02():
    return render_template('level02.html')

@app.route('/level03')
def level03():
    return render_template('level03.html')

@app.route('/level04')
def level04():
    return render_template('level04.html')

@app.route('/admin_competency')
def admin_competency():
    return render_template('admin.html')

@app.route('/job_skill_levels')
def job_skill_levels():
    return render_template('job_skill_levels.html')

@app.route('/one_on_one')
def one_on_one():
    return render_template('1on1.html')

@app.route('/ai_messages/<int:employee_id>')
def ai_messages(employee_id):
    return render_template('aisapo1on1.html', employee_id=employee_id)

@app.route('/employees/add', methods=['POST'])
def add_employee():
    name = request.form['name']
    employee_number = request.form['employee_number']
    department = request.form['department']
    position = request.form['position']
    hire_date_str = request.form['hire_date']  # Get date as string
    new_employee = Employee(
        name=name,
        employee_number=employee_number,
        department=department,
        position=position,
        hire_date=hire_date_str,
    )  # Use the date object
    db.session.add(new_employee)
    db.session.commit()

    return redirect(url_for('admin_dashboard'))  # admin_dashboard ページにリダイレクト

@app.route('/employees')
def list_employees():
    employees = Employee.query.all()
    return render_template('employees.html', employees=employees)

@app.route('/employee/<int:employee_id>/history')
def employee_history(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    history = []

    # Fetch records from different tables
    okrs = Okr.query.filter_by(employee_id=employee_id).all()
    one_on_ones = OneOnOneRecord.query.filter_by(employee_id=employee_id).all()
    job_skills = JobSkillLevel.query.filter_by(employee_id=employee_id).all()
    job_tasks = JobTaskList.query.filter_by(employee_id=employee_id).all()
    ai_support = AiSupportRecord.query.filter_by(employee_id=employee_id).all()

    # Add records to history list with type identifier
    for record in okrs:
        record.record_type = 'OKR'
        history.append(record)
    for record in one_on_ones:
        record.record_type = '1on1'
        history.append(record)
    for record in job_skills:
        record.record_type = 'Job Skill'
        history.append(record)
    for record in job_tasks:
        record.record_type = 'Job Task'
        history.append(record)
    for record in ai_support:
        record.record_type = 'AI Support'
        history.append(record)

    # Sort history by created_at date, newest first
    history.sort(key=lambda x: x.created_at, reverse=True)

    return render_template('employee_history.html', employee=employee, history=history)


if __name__ == '__main__':
    # Create database tables within an application context
    with app.app_context():
        db.create_all()
        #db.session.commit()

    app.run(debug=True)
