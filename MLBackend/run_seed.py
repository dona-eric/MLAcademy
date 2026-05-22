import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "MLBackend.settings")
django.setup()

import seed_aws_data_science
seed_aws_data_science.create_seed_data()
