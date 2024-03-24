import requests
import socket
import sys

def get_client_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    client_ip = s.getsockname()[0]
    s.close()
    return client_ip
    
    
def send_http_packet(name, num1, num2):
    url = f"http://10.198.137.118:1050"
    payload = f"{get_client_ip()}, {name}, {num1} / {num2}"
    response = requests.post(url, data=payload)


name = sys.argv[1]
num1 = sys.argv[2]
num2 = sys.argv[3]
send_http_packet(name, num1, num2)