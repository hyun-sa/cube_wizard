from PyQt5 import QtCore, QtGui, QtWidgets, QtWebEngineWidgets
from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QMessageBox, QMainWindow, QDialog, QVBoxLayout, QHBoxLayout, QLineEdit, QListWidget
from PyQt5.QtCore import pyqtSlot, QEvent
import multiprocessing, time, os ,shutil, requests, sys


class MainWindow(QtWidgets.QMainWindow):
    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)

        self.browser = QtWebEngineWidgets.QWebEngineView()
        file_path = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), "data")), "block.html")
  
        local_url = QtCore.QUrl.fromLocalFile(file_path)
        print(file_path)
        self.browser.setUrl(local_url)
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
            shutil.copy2(save_temp, file_path)
        else:
            print("파일 선택 취소")
            
    
    def file_load(self):
        dialog = QtWidgets.QFileDialog.getOpenFileName(None, "파일 불러오기", "", "cw 파일 (*.cw)")
        file_path = dialog[0]
        if file_path:
            shutil.copy2(file_path, save_temp)
            with open(save_temp, 'rb') as f:
                files = {'file' : (save_temp, f)}
                requests.post("http://localhost:15000", files=files)
        else:
            print("파일 선택 취소")
            

    def file_adv_save(self):
        dialog = QtWidgets.QFileDialog.getSaveFileName(None, "파일 저장", "", "cw 파일 (*.cw)")
        file_path = dialog[0]
        if file_path:
            shutil.copy2("./data/temppy", file_path)
        else:
            print("파일 선택 취소")

    def network_select(self):
        self.dialog = HostListDialog()
        self.dialog.exec_()
        #성공했다면
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
        self.setWindowTitle("Host List")
        
        self.hosts = []
        with open('./data/hosts.txt') as f:
            for line in f.readlines():
                self.hosts.append(line[:-1])
        self.displayed_hosts = [] 
        
        self.layout = QVBoxLayout()
        self.setLayout(self.layout)
        
        self.create_search_bar()
        self.create_host_list()
        self.create_buttons()
        
        
    def create_search_bar(self):
        self.search_bar = QLineEdit(self)
        self.search_bar.setPlaceholderText("검색...")
        self.search_bar.textChanged.connect(self.filter_host_list)
        self.layout.addWidget(self.search_bar)
        
        
    def create_host_list(self):
        self.host_list = QListWidget(self)
        self.host_list.itemDoubleClicked.connect(self.hostDoubleClicked) 
        self.layout.addWidget(self.host_list)
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
        print("호스트 추가")
        
        
    def new_host(self):
        print("새 호스트 등록")
        
        
    def hostDoubleClicked(self, item):
        print(f"Selected host: {item.text()}")
        self.close()
        

def sending_files():
    print("전송")
    dirty_checker = "./data/isdirty"
    while True:
        if not os.path.isfile(dirty_checker):
            time.sleep(3)
            continue
        #전송구문
        os.remove(dirty_checker)

if __name__ == "__main__":
    save_temp = "./data/temp"
    network_process = multiprocessing.Process(target=sending_files)
    app = QtWidgets.QApplication([])
    window = MainWindow()
    window.show()
    app.exec_()
