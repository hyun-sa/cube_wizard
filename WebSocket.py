import asyncio
import websockets
import os


class FileAdaptor:
    _instance = None
    data = None
    load = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)

        return cls._instance

    def __init__(self):
        self.data = None
        self.load = None

    def serverOn(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        start_server = websockets.serve(self.WebSocketServer, "localhost", 9998, ping_interval=None)

        # 비동기로 서버를 대기
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

    def getdata(self):
        print(self.data)
        return self.data

    def save_as_file(self, file, filename):
        app_data_path = os.getenv('LOCALAPPDATA')
        dir_path = os.path.join(app_data_path, 'cubewizard', 'temp')
        file_path = os.path.join(dir_path, f"{filename}.cw")

        try:
            if not os.path.exists(file_path):
                os.makedirs(dir_path, mode=0o777, exist_ok=True)
            with open(file_path, 'w') as f:
                f.write(file)
                print(f'File saved to {file_path}')

        except OSError as e:
            print(f'Error Caused by: {e.strerror}')

    def loaddata(self, filename='test'):
        app_data_path = os.getenv('LOCALAPPDATA')
        dir_path = os.path.join(app_data_path, 'cubewizard', 'temp')
        file_path = os.path.join(dir_path, f'{filename}.cw')
        print(filename)
        try:
            with open(file_path, 'r') as f:
                file = f.read()
                print(f'File loaded {file}')
                self.load = file

        except OSError as e:
            print(file_path)
            print(f'Error Caused by: {e.strerror}')

    # def loaddata(self, file):
    #     self.load = self.load_file(file, )

    async def WebSocketServer(self, websocket, path):
        while True:
            # 클라이언트로부터 메시지를 대기
            try:
                data = await websocket.recv()
                print("receive : " + data)
                if data != 'undefined':
                    self.data = data
                    print(self.data)
            except websockets.exceptions.ConnectionClosedError as e:
                print(f"Connection closed unexpectedly: {e}")

            # 클라인언트로 echo를 붙여서 재전송
            # await websocket.send("echo : " + data)

            # 클라이언트로 데이터 전송
            if self.load is not None:
                await websocket.send(self.load)
                print("send" + self.load)
                self.load = None
