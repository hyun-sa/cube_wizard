from PyQt5 import QtCore, QtGui, QtWidgets, QtWebEngineWidgets
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QMessageBox, QMainWindow, QDialog, QVBoxLayout, QHBoxLayout, QLineEdit, QListWidget, QLabel, QMenu, QCheckBox, QDialogButtonBox
from PyQt5.QtCore import pyqtSlot, QEvent, Qt
import multiprocessing, time, os ,shutil, requests, sys
from WebSocket import FileAdaptor
import threading
import requests

HOST = "10.198.137.118"
PORT = 8000



class MainWindow(QtWidgets.QMainWindow):
    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)

        self.browser = QtWebEngineWidgets.QWebEngineView()
        file_path = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), "data")), "block.html")
  
        local_url = QtCore.QUrl.fromLocalFile(file_path)
        print(file_path)

        # local_file 활용
        # self.browser.setUrl(local_url)
        # Node.js 활용
        self.browser.setUrl(QtCore.QUrl("http://localhost:8080/"))

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

        connected_student_action = QtWidgets.QAction("&연결된 학습자 확인", self)
        connected_student_action.triggered.connect(self.student_connected)
        student_menu.addAction(connected_student_action)

        program_run_action = QtWidgets.QAction("&프로그램 실행", self)
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
            network_process.start()

    def network_check(self):
        print("네트워크 확인")

    def student_all(self):
        print("전체 학습자 확인")

    def student_connected(self):
        print("연결된 학습자 확인")

    def program_run(self):
        print("프로그램 실행")
        
    def closeEvent(self, event: QEvent) -> None:
        reply = QMessageBox.question(self, '종료', '저장되지 않은 내용은 삭제됩니다. 정말로 종료하시겠습니까?', QMessageBox.Yes | QMessageBox.No, QMessageBox.No)
        if reply == QMessageBox.Yes:
            if network_process and network_process.is_alive():
                network_process.kill()
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
            print("Private:", new_dialog.privateCheckBox.isChecked())
            print("Host Password:", new_dialog.passwordLineEdit.text())
            print("Host Name:", new_dialog.nameLineEdit.text())
            print("Host Port:", new_dialog.portLineEdit.text())
        
        
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



def sending_files():
    print("전송")
    dirty_checker = "./data/isdirty"
    while True:
        if not os.path.isfile(dirty_checker):
            time.sleep(3)
            continue
        FILE_PATH = "./data/temp.cw"

        url = f"http://{HOST}:{PORT}/file"

        try:
            with open(FILE_PATH, "rb") as f:
                file_data = f.read()

            response = requests.post(url, data=file_data)
            response.raise_for_status()
            print(response.text)
        except requests.exceptions.RequestException as e:
            print(f"Error occurred: {e}")
        os.remove(dirty_checker)


def openWebsocket():
    fileadapter = FileAdaptor.get_instance()
    fileadapter.serverOn()

if __name__ == "__main__":
    webSocketThread = threading.Thread(target=openWebsocket)
    webSocketThread.start()

    save_temp = "./data/temp"
    hosts_file = './data/localhosts.txt'
    network_process = multiprocessing.Process(target=sending_files)
    app = QtWidgets.QApplication([])
    window = MainWindow()
    window.show()
    app.exec_()
