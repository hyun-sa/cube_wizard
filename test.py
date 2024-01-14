from PyQt5 import QtCore, QtGui, QtWidgets, QtWebEngineWidgets
import os


class MainWindow(QtWidgets.QMainWindow):
    def __init__(self, *args, **kwargs):
        super(MainWindow, self).__init__(*args, **kwargs)

        self.browser = QtWebEngineWidgets.QWebEngineView()
        file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "blockly.html"))
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

    def file_save(self):
        print("파일 저장")

    def file_adv_save(self):
        print("파일 고급어 변환저장")

    def network_select(self):
        print("네트워크 선택")

    def network_check(self):
        print("네트워크 확인")

    def student_all(self):
        print("전체 학습자 확인")

    def student_connected(self):
        print("연결된 학습자 확인")

    def program_run(self):
        print("프로그램 실행")

if __name__ == "__main__":
    app = QtWidgets.QApplication([])
    window = MainWindow()
    window.show()
    app.exec_()
