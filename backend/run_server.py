import uvicorn
import argparse
from .database import engine, Base


def main():
    parser = argparse.ArgumentParser(description='运行药物管理系统服务器')
    parser.add_argument('--host', default='127.0.0.1', help='服务器主机地址')
    parser.add_argument('--port', type=int, default=8000, help='服务器端口')
    parser.add_argument('--reload', action='store_true', help='启用自动重载')

    args = parser.parse_args()

    # 确保数据库表已创建
    Base.metadata.create_all(bind=engine)

    uvicorn.run(
        "backend.main:app",
        host=args.host,
        port=args.port,
        reload=args.reload
    )


if __name__ == "__main__":
    main()