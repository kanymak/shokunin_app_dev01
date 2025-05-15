import sqlite3

conn = sqlite3.connect('instance/your_database.db')
cursor = conn.cursor()

# employees テーブルに初期データを投入
cursor.execute("INSERT INTO employees (name, employee_number, department, position, hire_date) VALUES (?, ?, ?, ?, ?)",
               ('山田太郎', '1001', '工務部', '主任', '2015-04-01'))
cursor.execute("INSERT INTO employees (name, employee_number, department, position, hire_date) VALUES (?, ?, ?, ?, ?)",
               ('田中花子', '1002', '人事部', '課長', '2010-04-01'))

# admin_okr_settings テーブルに初期データを投入
cursor.execute("INSERT INTO admin_okr_settings (level, objective, key_result1, key_result2, key_result3) VALUES (?, ?, ?, ?, ?)",
               ('01', '現場作業の効率向上', '作業時間を10％短縮', '安全管理のチェックリスト遵守率を95％に', 'クレーム件数を半減'))
cursor.execute("INSERT INTO admin_okr_settings (level, objective, key_result1, key_result2, key_result3) VALUES (?, ?, ?, ?, ?)",
               ('02', 'チームワークの向上', 'チーム内のコミュニケーション回数を20％増加', 'チーム目標の達成率を80％以上', 'チームメンバーの満足度を向上'))

conn.commit()
conn.close()

print("Database seeding complete.")
