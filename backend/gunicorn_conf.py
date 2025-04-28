# backend/gunicorn_conf.py

import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
bind = "0.0.0.0:8000"
timeout = 30
loglevel = "info"
accesslog = "-"       # ghi log truy cập ra stdout
errorlog = "-"        # ghi log lỗi ra stdout
