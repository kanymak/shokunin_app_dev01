-- User テーブル
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- CompetencyItem テーブル
CREATE TABLE competency_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    criteria TEXT NOT NULL,
    coefficient REAL NOT NULL
);

-- CompetencyEvaluation テーブル
CREATE TABLE competency_evaluation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    improvement TEXT,
    points REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (item_id) REFERENCES competency_item(id)
);

-- employees テーブル
CREATE TABLE employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    employee_number TEXT NOT NULL,
    department TEXT,
    position TEXT,
    hire_date DATE
);

-- okrs テーブル
CREATE TABLE okrs (
    okr_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    objective TEXT,
    key_result1 TEXT,
    key_result1_progress INTEGER,
    key_result1_memo TEXT,
    key_result2 TEXT,
    key_result2_progress INTEGER,
    key_result2_memo TEXT,
    key_result3 TEXT,
    key_result3_progress INTEGER,
    key_result3_memo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- admin_okr_settings テーブル
CREATE TABLE admin_okr_settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT,
    objective TEXT,
    key_result1 TEXT,
    key_result2 TEXT,
    key_result3 TEXT
);

-- one_on_one_records テーブル
CREATE TABLE one_on_one_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    record_type TEXT,
    record_date DATE,
    okr_progress TEXT,
    meeting_minutes TEXT,
    feedback TEXT,
    expert_content TEXT,
    follow_up TEXT,
    self_reflection TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    competency_evaluation_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (competency_evaluation_id) REFERENCES competency_evaluation(id)
);

-- job_skill_levels テーブル
CREATE TABLE job_skill_levels (
    level_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    business TEXT,
    business_unit TEXT,
    difficulty INTEGER,
    beginner INTEGER,
    intermediate INTEGER,
    chief_or_above INTEGER,
    managerial_position INTEGER,
    required_skills TEXT,
    acquisition_method TEXT,
    evaluation_method TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- job_task_lists テーブル
CREATE TABLE job_task_lists (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    task_name TEXT,
    task_details TEXT,
    video_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- ai_support_records テーブル
CREATE TABLE ai_support_records (
    record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    record_date DATE,
    trend_analysis TEXT,
    alert_message TEXT,
    sentiment_analysis TEXT,
    ai_chat_session TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
