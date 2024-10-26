# PyQt5 관련 모듈
from PyQt5 import QtCore, QtGui, QtWidgets, QtWebEngineWidgets
from PyQt5.QtWidgets import (QApplication, QWidget, QPushButton, QMessageBox, 
                             QMainWindow, QDialog, QVBoxLayout, QHBoxLayout, 
                             QLineEdit, QListWidget, QLabel, QMenu, QCheckBox, 
                             QDialogButtonBox)
from PyQt5.QtCore import pyqtSlot, QEvent, Qt

# 기타 모듈
import multiprocessing
import time
import os
import shutil
import requests
import sys
import threading
import json
import socket
import asyncio
import websockets
import psutil

# HTTP 서버 관련 모듈
import http.server
import socketserver
import http.client

# Tkinter 관련 모듈
import tkinter as tk
from tkinter import ttk

# 이미지 처리 라이브러리
from PIL import Image, ImageTk



Host_passwd = None
SERVER_HOST = '10.198.137.118'
SERVER_PORT = 8000

host_on = False
client_addr = None

class MainWindow(QtWidgets.QMainWindow):
    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)

        self.browser = QtWebEngineWidgets.QWebEngineView()
        file_path = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), "data")), "main\index.html")
  
        local_url = QtCore.QUrl.fromLocalFile(file_path)
        print(file_path)

        # local_file 활용
        self.browser.setUrl(local_url)
        # Node.js 활용
        #self.browser.setUrl(QtCore.QUrl("http://localhost:8080/"))
        
        self.setCentralWidget(self.browser)

        navtb = QtWidgets.QToolBar("Navigation")
        self.addToolBar(navtb)

        file_menu = self.menuBar().addMenu("&파일")
        save_action = QtWidgets.QAction("&파일 저장", self)
        save_action.triggered.connect(self.file_save)
        file_menu.addAction(save_action)
        
        load_action = QtWidgets.QAction("&파일 불러오기", self)
        load_action.triggered.connect(self.file_load)
        file_menu.addAction(load_action)

        advanced_save_action = QtWidgets.QAction("&파일 고급어 변환저장", self)
        advanced_save_action.triggered.connect(self.file_adv_save)
        file_menu.addAction(advanced_save_action)

        network_menu = self.menuBar().addMenu("&네트워크")
        select_action = QtWidgets.QAction("&네트워크 선택", self)
        select_action.triggered.connect(self.network_select)
        network_menu.addAction(select_action)

        check_action = QtWidgets.QAction("&네트워크 확인", self)
        check_action.triggered.connect(self.network_check)
        network_menu.addAction(check_action)

        student_menu = self.menuBar().addMenu("&학습자관리")
        all_student_action = QtWidgets.QAction("&전체 학습자 확인", self)
        all_student_action.triggered.connect(self.student_all)
        student_menu.addAction(all_student_action)

        program_run_action = QtWidgets.QAction("&도움말", self)
        navtb.addAction(program_run_action)
        program_run_action.triggered.connect(self.program_run)
        
                
        if os.path.isfile(save_temp):
            check_temp = QMessageBox.question(self, 'Cube Wizard', "이전에 작성한 파일을 불러오시겠습니까?", QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
            if check_temp == QMessageBox.No:
                os.remove(save_temp)
                
                
    def file_save(self):
        dialog = QtWidgets.QFileDialog.getSaveFileName(None, "파일 저장", "", "cw 파일 (*.cw)")
        file_path = dialog[0]
        if file_path:
            fileAdapter = FileAdaptor.get_instance()
            file = fileAdapter.getdata()
            fileAdapter.save_as_file(file, file_path)
            # shutil.copy2(save_temp, file_path)
        else:
            print("파일 선택 취소")

    # # file_save legacy
    # def file_save(self):
    #     print("파일 저장")
    #     fileAdapter = FileAdaptor.get_instance()
    #     file = fileAdapter.getdata()
    #     fileAdapter.save_as_file(file, "test")
    
    def file_load(self):
        dialog = QtWidgets.QFileDialog.getOpenFileName(None, "파일 불러오기", "", "cw 파일 (*.cw)")
        file_path = dialog[0]
        if file_path:
            fileAdapter = FileAdaptor.get_instance()
            fileAdapter.loaddata(file_path)
            # shutil.copy2(file_path, save_temp)
            # with open(save_temp, 'rb') as f:
            #     files = {'file' : (save_temp, f)}
            #     requests.post("http://localhost:15000", files=files)
        else:
            print("파일 선택 취소")


    # # file_load legacy
    # def file_load(self):
    #     print("파일 불러오기")
    #     fileAdapter = FileAdaptor.get_instance()
    #     fileAdapter.loaddata("load_test")

    def file_adv_save(self):
        dialog = QtWidgets.QFileDialog.getSaveFileName(None, "파일 저장", "", "cw 파일 (*.cw)")
        file_path = dialog[0]
        if file_path:
            shutil.copy2("./data/temppy", file_path)
        else:
            print("파일 선택 취소")

    def network_select(self):
        self.dialog = HostListDialog()
        selected_host = self.dialog.exec_()
        if selected_host:
            print(f"Selected host: {selected_host}")
            network_process = multiprocessing.Process(target=sending_files, args=(selected_host,), daemon=True)
            network_process.start()

    def network_check(self):
        msg = QMessageBox()
        msg.setWindowTitle("연결 확인")
        if client_addr:
            msg.setText(f"IP는 {client_addr}입니다.")
        else:
            msg.setText(f"연결되지 않았습니다.")
        msg.setIcon(QMessageBox.Information)
        msg.setStandardButtons(QMessageBox.Ok)
        msg.exec_()

    def student_all(self):
        if host_on:
            # 데이터 디렉토리 경로
            data_directory = './data'  # 또는 절대 경로를 사용할 수 있습니다.

            # .cw 파일 목록 가져오기
            cw_files = [f for f in os.listdir(data_directory) if f.endswith('.cw')]

            # 새로운 다이얼로그 생성
            dialog = QDialog(self)
            dialog.setWindowTitle("연결된 학습자 파일 목록")

            layout = QVBoxLayout()
            dialog.setLayout(layout)

            # 파일 목록을 리스트 위젯에 추가
            list_widget = QListWidget()
            list_widget.addItems(cw_files)  # .cw 파일 목록 추가
            layout.addWidget(list_widget)

            # 확인 버튼 추가
            ok_button = QPushButton("확인", dialog)
            ok_button.clicked.connect(dialog.accept)  # 버튼 클릭 시 다이얼로그 종료
            layout.addWidget(ok_button)

            # 다이얼로그 표시
            dialog.exec_()
        else:
            msg = QMessageBox()
            msg.setWindowTitle("연결 확인")
            msg.setText(f"호스트가 활성화되지 않았습니다.")
            msg.setIcon(QMessageBox.Information)
            msg.setStandardButtons(QMessageBox.Ok)
            msg.exec_()

    def program_run(self):
        help_thread = threading.Thread(target=run_tkinter_slider)
        help_thread.start()
        
    def closeEvent(self, event: QEvent) -> None:
        reply = QMessageBox.question(self, '종료', '저장되지 않은 내용은 삭제됩니다. 정말로 종료하시겠습니까?', QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
        if reply == QMessageBox.Yes:
            current_process = psutil.Process(os.getpid())
        
        # 자식 프로세스 종료
            for child in current_process.children(recursive=True):
                child.terminate()  # 자식 프로세스 종료
                child.wait()  # 자식 프로세스가 종료될 때까지 대기
            file_adaptor = FileAdaptor.get_instance()  # FileAdaptor 인스턴스 가져오기
            file_adaptor.stop_server()  # 서버 종료
            event.accept()
        else:
            event.ignore()
        

class HostListDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.selected_host = None
        self.setWindowTitle("Host List")
        
        self.hosts = []
        self.displayed_hosts = [] 
        
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)
        
        self.create_search_bar()
        self.create_host_list()
        self.create_buttons()
    
    
    def exec_(self):
        result = super().exec_()
        return self.selected_host
        
        
    def create_search_bar(self):
        self.search_bar = QLineEdit(self)
        self.search_bar.setPlaceholderText("검색...")
        self.search_bar.textChanged.connect(self.filter_host_list)
        self.layout.addWidget(self.search_bar)
        
        
    def create_host_list(self):
        self.host_list = QListWidget(self)
        self.host_list.itemDoubleClicked.connect(self.hostDoubleClicked) 
        self.layout.addWidget(self.host_list)
        self.host_list.setContextMenuPolicy(Qt.CustomContextMenu)
        self.host_list.customContextMenuRequested.connect(self.show_context_menu) 
        self.refresh_host_list()
        
        
    def show_context_menu(self, position):
        context_menu = QMenu(self)
        delete_action = context_menu.addAction("삭제")
        action = context_menu.exec_(self.host_list.mapToGlobal(position))
        if action == delete_action:
            self.confirm_delete()
        
        
    def confirm_delete(self):
        reply = QMessageBox.question(self, '삭제 확인', '정말로 삭제하시겠습니까?', QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
        if reply == QMessageBox.Yes:
            self.delete_selected_host()
            
            
    def delete_selected_host(self):
        selected_item = self.host_list.currentItem()
        if selected_item:
            selected_host = selected_item.text()
            del_idx = self.displayed_hosts.index(selected_host)
            del self.displayed_hosts[del_idx]
            with open(hosts_file, "w") as fw:
                for i in self.displayed_hosts:
                    fw.write(f"{i}\n")
            self.refresh_host_list()
        
        
    def create_buttons(self):
        self.buttons_layout = QHBoxLayout()
        
        self.refresh_button = QPushButton("Refresh", self)
        self.add_host_button = QPushButton("Add Host", self)
        self.new_host_button = QPushButton("New Host", self)
        self.cancel_button = QPushButton("Cancel", self)
        
        self.buttons_layout.addWidget(self.refresh_button)
        self.buttons_layout.addWidget(self.add_host_button)
        self.buttons_layout.addWidget(self.new_host_button)
        self.buttons_layout.addWidget(self.cancel_button)
        
        self.layout.addLayout(self.buttons_layout)
        
        self.refresh_button.clicked.connect(self.refresh_host_list)
        self.add_host_button.clicked.connect(self.add_host)
        self.new_host_button.clicked.connect(self.new_host)
        self.cancel_button.clicked.connect(self.close)
        
        
    def refresh_host_list(self):
        self.host_list.clear()
        self.hosts = []
        with open(hosts_file) as f:
            for line in f.readlines():
                if line[0] == "*":
                    self.hosts.append(line[2:line.rfind('*')])
                else:
                    self.hosts.append(line[:-1])
                    
        for host in self.hosts:
            self.host_list.addItem(host)
        self.displayed_hosts = self.hosts[:]
        
        
    def filter_host_list(self):
        search_text = self.search_bar.text().lower()
        self.host_list.clear()
        self.displayed_hosts = [host for host in self.hosts if search_text in host.lower()]
        for host in self.displayed_hosts:
            self.host_list.addItem(host)
            
            
    def add_host(self):
        add_dialog = AddHostDialog()
        if add_dialog.exec_() == QDialog.Accepted:
            self.refresh_host_list()
        
        
    def new_host(self):
        new_dialog = NewHostDialog()
        result = new_dialog.exec_()
        
        if result:
            if new_dialog.portLineEdit.text():
                port = int(new_dialog.portLineEdit.text())
            else:
                port = 15000
            if new_dialog.passwordLineEdit.text():
                Host_passwd = int(new_dialog.passwordLineEdit.text())
            Host_process = multiprocessing.Process(target=host_function, args=(port,), daemon=True)
            Host_process.start()
        
        
    def hostDoubleClicked(self, item):
        self.selected_host = item.text()
        self.close()
        
        
class AddHostDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("호스트 추가")
        
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)
        
        self.create_form_fields()
        self.create_buttons()
        
    def create_form_fields(self):
        self.host_name_label = QLabel("호스트 이름 : ")
        self.host_name_input = QLineEdit(self)
        self.layout.addWidget(self.host_name_label)
        self.layout.addWidget(self.host_name_input)
        
        self.host_password_label = QLabel("호스트 비밀번호(필요시) : ")
        self.host_password_input = QLineEdit(self)
        self.host_password_input.setEchoMode(QLineEdit.Password)
        self.layout.addWidget(self.host_password_label)
        self.layout.addWidget(self.host_password_input)
        
        self.host_address_label = QLabel("호스트 주소 : ")
        self.host_address_input = QLineEdit(self)
        self.layout.addWidget(self.host_address_label)
        self.layout.addWidget(self.host_address_input)
        
    def create_buttons(self):
        self.buttons_layout = QHBoxLayout()
        
        self.confirm_button = QPushButton("확인", self)
        self.confirm_button.clicked.connect(self.confirm)
        self.buttons_layout.addWidget(self.confirm_button)
        
        self.cancel_button = QPushButton("취소", self)
        self.cancel_button.clicked.connect(self.reject)
        self.buttons_layout.addWidget(self.cancel_button)
        
        self.layout.addLayout(self.buttons_layout)
        
    def confirm(self):
        global find_server_idx
        host_name = self.host_name_input.text()
        host_password = self.host_password_input.text()
        host_address = self.host_address_input.text()
        
        if host_address.find(':') == -1:
            host_address += ":15001"
        
        if host_password:
            host_text = f"* {host_name} : {host_address} * {host_password}\n"
        else:
            host_text = f"{host_name} : {host_address}\n"
        
        with open(hosts_file, "r") as fw:
            temp_hosts = fw.readlines()
            temp_hosts.append(host_text)
        
        with open(hosts_file, "w") as fw:
            for i in temp_hosts:
                fw.write(i)
        QMessageBox.information(self, "등록 완료", "등록되었습니다")
        
        self.accept()


class NewHostDialog(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("New Host")
        self.setGeometry(100, 100, 200, 200)
        
        self.layout = QVBoxLayout()
        
        self.privateCheckBox = QCheckBox("비공개")
        self.layout.addWidget(self.privateCheckBox)
        
        self.passwordLineEdit = QLineEdit()
        self.passwordLineEdit.setPlaceholderText("호스트 비밀번호")
        self.layout.addWidget(self.passwordLineEdit)
        
        self.nameLineEdit = QLineEdit()
        self.nameLineEdit.setPlaceholderText("호스트 이름")
        self.layout.addWidget(self.nameLineEdit)
        
        self.portLineEdit = QLineEdit()
        self.portLineEdit.setPlaceholderText("호스트 포트")
        self.layout.addWidget(self.portLineEdit)
        
        buttonsLayout = QHBoxLayout()
        self.okButton = QPushButton("확인")
        self.okButton.clicked.connect(self.accept)
        buttonsLayout.addWidget(self.okButton)
        
        self.cancelButton = QPushButton("취소")
        self.cancelButton.clicked.connect(self.reject)
        buttonsLayout.addWidget(self.cancelButton)
        
        self.layout.addLayout(buttonsLayout)
        
        self.setLayout(self.layout)


class StudentView(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Viewer")
        self.setGeometry(100, 100, 800, 600)
        
        layout = QVBoxLayout()
        self.browser = QtWebEngineWidgets.QWebEngineView()
        
        file_path = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), "data")), "read_only_viewer\index.html")
  
        local_url = QtCore.QUrl.fromLocalFile(file_path)
        self.browser.setUrl(local_url)
        layout.addWidget(self.browser)
        
        self.setLayout(layout)
        self.browser.setAttribute(Qt.WA_TransparentForMouseEvents)
    


def sending_files(path_to_send):
    print(f"{path_to_send}")
    dirty_checker = "./data/isdirty"
    if path_to_send[0] == "*":
        ipaddr = list(path_to_send.split(":"))[1].strip()
        port = list(path_to_send.split(":"))[2].split("*")[0].strip()
        passwd = list(path_to_send.split("*"))[2].strip()
    else:
        ipaddr = list(path_to_send.split(":"))[1].strip()
        port = list(path_to_send.split(":"))[2].strip()
        passwd = None
    while True:
        if not os.path.isfile(dirty_checker):
            time.sleep(3)
            continue
        FILE_PATH = "./data/temp.cw"

        url = f"http://{ipaddr}:{port}/file"

        try:
            if passwd:
                response = requests.post(f"{url}/password", data=passwd.encode())
                response.raise_for_status()

            if not passwd or response.text == "Password accepted":
                with open(FILE_PATH, "rb") as f:
                    file_data = f.read()
                response = requests.post(url, data=file_data)
                response.raise_for_status()
                print(response.text)
            else:
                print("Password not accepted. File not sent.")
                break
        except requests.exceptions.RequestException as e:
            print(f"Error occurred: {e}")
        os.remove(dirty_checker)
        
        
def host_function(port):
    host_on = True
    conn = http.client.HTTPConnection(f"{SERVER_HOST}:{SERVER_PORT}")
    data = {'ip': f"{socket.gethostbyname(socket.gethostname())}", 'port': f"{port}"}
    headers = {'Content-Type': 'application/json'}
    conn.request('POST', '/register', json.dumps(data), headers)
    response = conn.getresponse()
    print(f"Host registered with status code: {response.status}")
    
    with socketserver.TCPServer(("", port), FileReceiveHandler) as httpd:
        print(f"Waiting for file transfer at http://localhost:{port}/file")
        httpd.serve_forever()


def get_host_list():
    conn = http.client.HTTPConnection(f"{SERVER_HOST}:{SERVER_PORT}")
    conn.request('GET', '/hosts')
    response = conn.getresponse()
    if response.status == 200:
        host_list = json.loads(response.read())
        print(f"Host list: {host_list}")
    else:
        print(f"Error getting host list: {response.status}")


class FileReceiveHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/file':
            content_length = int(self.headers['Content-Length'])
            file_data = self.rfile.read(content_length)

            with open("received_cw", "wb") as f:
                f.write(file_data)

            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"File received successfully.")
        elif self.path == '/password':
            content_length = int(self.headers['Content-Length'])
            password = self.rfile.read(content_length).decode()
            if not Host_passwd or password == Host_passwd:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Password accepted")
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"Password not accepted")


class ImageSlider:
    def __init__(self, root, images):
        self.root = root
        self.images = images
        self.index = 0

        self.label = ttk.Label(root)
        self.label.pack()

        self.update_image()

        self.btn_next = ttk.Button(root, text="다음", command=self.next_image)
        self.btn_next.pack(side=tk.RIGHT)

        self.btn_prev = ttk.Button(root, text="이전", command=self.prev_image)
        self.btn_prev.pack(side=tk.LEFT)

    def update_image(self):
        img = Image.open(self.images[self.index])
        img = img.resize((1024, 768), Image.LANCZOS)
        self.photo = ImageTk.PhotoImage(img)
        self.label.config(image=self.photo)
        self.label.image = self.photo

    def next_image(self):
        self.index = (self.index + 1) % len(self.images)
        self.update_image()

    def prev_image(self):
        self.index = (self.index - 1) % len(self.images)
        self.update_image()


class FileAdaptor:
    _instance = None
    data = None
    load = None
    server = None
    running = True
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
        self.server = websockets.serve(self.WebSocketServer, "localhost", 9998, ping_interval=None)

        # 비동기로 서버를 대기
        asyncio.get_event_loop().run_until_complete(self.server)
        asyncio.get_event_loop().run_forever()

    def getdata(self):
        print(self.data)
        return self.data

    def save_as_file(self, file, filename):
        app_data_path = os.getenv('LOCALAPPDATA')
        dir_path = os.path.join(app_data_path, 'cubewizard', 'temp')
        file_path = os.path.join(dir_path, f"{filename}")

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
        file_path = os.path.join(dir_path, f'{filename}')
        print(filename)
        try:
            with open(file_path, 'r') as f:
                file = f.read()
                print(f'File loaded {file}')
                self.load = file

        except OSError as e:
            print(file_path)
            print(f'Error Caused by: {e.strerror}')
            
    def stop_server(self):
        self.running = False
        if self.server:
            self.server.ws_server.close()  # WebSocket 서버 종료
            print("WebSocket 서버가 종료되었습니다.")
    # def loaddata(self, file):
    #     self.load = self.load_file(file, )

    async def WebSocketServer(self, websocket, path):
        while self.running:  # 서버가 실행 중일 때만 반복
            try:
                data = await websocket.recv()
                print("receive : " + data)
                if data != 'undefined':
                    self.data = data
                    print(self.data)
            except websockets.exceptions.ConnectionClosedError as e:
                print(f"Connection closed unexpectedly: {e}")
                break
            except Exception as e:
                print(f"Error: {e}")
                break

            # 클라인언트로 echo를 붙여서 재전송
            # await websocket.send("echo : " + data)

            # 클라이언트로 데이터 전송
            if self.load is not None:
                await websocket.send(self.load)
                print("send" + self.load)
                self.load = None



def run_tkinter_slider():
    root = tk.Tk()
    root.title("도움말")

    image_files = ['data/imageslider/0.png', 'data/imageslider/1.png', 
                   'data/imageslider/2.png', 'data/imageslider/3.png']
    slider = ImageSlider(root, image_files)

    root.mainloop()


def openWebsocket():
    fileadapter = FileAdaptor.get_instance()
    fileadapter.serverOn()

if __name__ == "__main__":
    
    slider_thread = threading.Thread(target=run_tkinter_slider)
    slider_thread.start()
    
    webSocketThread = threading.Thread(target=openWebsocket)
    webSocketThread.start()

    save_temp = "./data/temp"
    hosts_file = './data/localhosts.txt'
    app = QtWidgets.QApplication([])
    window = MainWindow()
    window.show()
    app.exec_()
