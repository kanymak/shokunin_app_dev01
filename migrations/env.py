import logging
from logging.config import fileConfig
import os  # os モジュールをインポート

from flask import current_app
from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# --- alembic.ini のパスを設定 ---
# このファイル(env.py)の親ディレクトリ(migrations/)のさらに親ディレクトリ(プロジェクトルート)を取得
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
# プロジェクトルートにある alembic.ini へのパスを作成
alembic_ini_path = os.path.join(project_root, 'alembic.ini')
# configオブジェクトが参照する設定ファイル名を上書き
config.config_file_name = alembic_ini_path
# --- ここまで修正 ---

# Interpret the config file for Python logging.
# This line sets up loggers basically.
# 変更後のパスを使ってログ設定を読み込む
if config.config_file_name is not None and os.path.exists(config.config_file_name): # ファイル存在チェックを追加
    fileConfig(config.config_file_name)
    logger = logging.getLogger('alembic.env')
else:
    # 設定ファイルが見つからない場合の基本的なログ設定（オプション）
    logging.basicConfig(level=logging.WARN)
    logger = logging.getLogger('alembic.env')
    logger.warning(f"Logging configuration file not found at: {config.config_file_name}")


def get_engine():
    try:
        # this works with Flask-SQLAlchemy<3 and Alchemical
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        # this works with Flask-SQLAlchemy>=3
        return current_app.extensions['migrate'].db.engine


def get_engine_url():
    try:
        return get_engine().url.render_as_string(hide_password=False).replace(
            '%', '%%')
    except AttributeError:
        return str(get_engine().url).replace('%', '%%')


# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata

# --- script_location も設定 (念のため) ---
config.set_main_option('script_location', current_dir)
# --- ここまで ---

config.set_main_option('sqlalchemy.url', get_engine_url())
target_db = current_app.extensions['migrate'].db

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def get_metadata():
    if hasattr(target_db, 'metadatas'):
        return target_db.metadatas[None]
    return target_db.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=get_metadata(), literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    # this callback is used to prevent an auto-migration from being generated
    # when there are no changes to the schema
    # reference: http://alembic.zzzcomputing.com/en/latest/cookbook.html
    def process_revision_directives(context, revision, directives):
        # ここに logging を追加してデバッグしやすくする (オプション)
        logger.debug("Processing revision directives...")
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')
        logger.debug("Finished processing revision directives.")


    conf_args = current_app.extensions['migrate'].configure_args
    if conf_args.get("process_revision_directives") is None:
        conf_args["process_revision_directives"] = process_revision_directives

    connectable = get_engine()

    # ここに接続確認のログを追加 (オプション)
    logger.info(f"Attempting to connect to database: {connectable.url}")

    with connectable.connect() as connection:
        # 接続成功ログ (オプション)
        logger.info("Database connection successful.")
        context.configure(
            connection=connection,
            target_metadata=get_metadata(),
            **conf_args
        )

        with context.begin_transaction():
            # マイグレーション実行前ログ (オプション)
            logger.info("Beginning migration transaction.")
            context.run_migrations()
            # マイグレーション実行後ログ (オプション)
            logger.info("Finished running migrations.")


# 実行前ログ (オプション)
logger.info(f"Running migrations in {'offline' if context.is_offline_mode() else 'online'} mode.")

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

# 完了ログ (オプション)
logger.info("env.py script finished.")