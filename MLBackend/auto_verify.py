import sqlite3
import time

for _ in range(120):
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("UPDATE users_customuser SET email_verified = 1 WHERE email_verified = 0")
    if cursor.rowcount > 0:
        print(f"Verified {cursor.rowcount} users")
        conn.commit()
    conn.close()
    time.sleep(1)
