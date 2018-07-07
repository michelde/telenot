import re
import binascii
import paho.mqtt.client as mqtt
import time
import logging
import socket, select, sys


logging.basicConfig(level=logging.DEBUG)

CONF_ACK = b'\x68\x02\x02\x68\x00\x02\x02\x16'
SEND_NORM = b'\x68\x02\x02\x68\x40\x02\x42\x16'
SEND_NORM_STR = "6802026840024216"
SEND_NORM_REGEX = r"^(.*)6802026840024216(.*?)"
SEND_16 = r"(.*)16$"
#SEND_NDAT = b'\x68\x3E\x3E\x68\x73\x02\x32\x24' 
#REGEX_NDAT = r"68....687302.."
#regex_ndat2 = r"683e3e687302.."
REGEX_MELDEBEREICHE = r"^(.*)6846466873023a24000500020(.*?)16$"
#REGEX_MELDEGRUPPEN = r"^683e3e6873023224(.*?)16$"
REGEX_MELDEGRUPPEN = r"^(.*)68....687302(.*?)16$"

class Telenot():
    """
    Just a simple Class example.
    """

    def __init__(self):
        """
        Initialize a new alarm clock.

        Arguments:

        * color (string): Color of the alarm clock.
        * sound (string): Ringing sound of the clock.
        """
        self.telenot_str = ""
        self.meldebereiche = [[1, None, "Fenster KG HWR", "openhab/alarm/fenster_kg_hwr"],
                             [2, None, "Fenster KG Fitness", "openhab/alarm/fenster_kg_fitness"],
                             [3, None, "Fenster KG Werkstatt", "openhab/alarm/fenster_kg_werkstatt"],
                             [4, None, "Tuer KG Werkstatt", "openhab/alarm/tuer_kg_werkstatt"],
                             [5,None, "Fenster KG Hobby", "openhab/alarm/fenster_kg_hobby"],
                             [6, None, "Fenster EG Vorrat", "openhab/alarm/fenster_eg_vorrat"],
                             [7, None, "Fenster EG Kueche", "openhab/alarm/fenster_eg_kueche"],
                             [8, None, "Fenster EG Wohnzimmer", "openhab/alarm/fenster_eg_wohnzimmer"],
                             [9, None, "Fenster EG Arbeiten", "openhab/alarm/fenster_eg_arbeiten"],
                             [10, None, "Fenster EG WC", "openhab/alarm/fenster_eg_wc"],
                             [11, None, "Tuer EG Flur", "openhab/alarm/tuer_eg_flur"],
                             [12, None, "Glasbruch", "openhab/alarm/glasbruch"],
                             [13, None, "Fenster DG Dach", "openhab/alarm/fenster_dg_dach"],
                             [14, None, "Rauchmelder", "openhab/alarm/brand"],
                             [15, None, "Bewegungsmelder", "openhab/alarm/bewegungsmelder"],
                             [16, None, "Sabotage", "openhab/alarm/sabotage"],
                             [17, None, "", ""],
                             [18, None, "", ""],
                             [19, None, "", ""],
                             [20, None, "", ""],
                             [21, None, "", ""],
                             [22, None, "", ""],
                             [23, None, "", ""],
                             [24, None, "", ""]
                             ]

        self.meldegruppen = [[1, None, "Fenster KG HWR", "openhab/alarm/fenster_kg_hwr"],
                             [2, None, "Fenster KG Fitness", "openhab/alarm/fenster_kg_fitness"],
                             [3, None, "Fenster KG Werkstatt", "openhab/alarm/fenster_kg_werkstatt"],
                             [4, None, "Tuer KG Werkstatt", "openhab/alarm/tuer_kg_werkstatt"],
                             [5, None, "Fenster KG Hobby", "openhab/alarm/fenster_kg_hobby"],
                             [6, None, "Fenster EG Vorrat", "openhab/alarm/fenster_eg_vorrat"],
                             [7, None, "Fenster EG Kueche", "openhab/alarm/fenster_eg_kueche"],
                             [8, None, "Glasbruch", "openhab/alarm/glasbruch"], 
                             [9, None, "Fenster EG Wohnzimmer re", "openhab/alarm/fenster_eg_wohnzimmer_re"],
                             [10, None, "Fenster EG Wohnzimmer Tuer", "openhab/alarm/fenster_eg_wohnzimmer_tuer"],
                             [11, None, "Fenster EG Arbeiten", "openhab/alarm/fenster_eg_arbeiten"],
                             [12, None, "Fenster EG WC", "openhab/alarm/fenster_eg_wc"],
                             [13, None, "Fenster EG Wohnzimmer li", "openhab/alarm/fenster_eg_wohnzimmer_li"],
                             [14, None, "Sabo Türklingel", "openhab/alarm/sabotage"],
                             [15, None, None, None],
                             [16, None, None, None]]


    def set_meldebereiche(self, telenot_response):
        logging.debug("Telenot String Org:" + telenot_response)
        self.telenot_str = telenot_response[56:58] + telenot_response[54:56] + telenot_response[52:54]
        logging.debug("Telenot String:" + self.telenot_str)
        binary_str = self.get_binary(telenot_response[56:58] + telenot_response[54:56] + telenot_response[52:54])
        binary_str = binary_str[::-1]
        logging.debug("Binary String:" + binary_str)
        for x in range(len(binary_str)):
            # initial set
            if self.meldebereiche[x][1] != int(binary_str[x]):
                logging.debug("change for: " + self.meldebereiche[x][2])
                # save new values
                self.meldebereiche[x][1] = int(binary_str[x])
                if mqtt_connected == True:
                    if self.meldebereiche[x][3] != "":
                        client.publish(self.meldebereiche[x][3], self.map_value(int(binary_str[x])))
                        log_str = "published " + self.meldebereiche[x][3], self.map_value(int(binary_str[x]))
                        logging.debug(log_str)
                else:
                    print(mqtt_connected)
        return ""

    def set_meldegruppen(self, telenot_response):
        self_telenot_str = ""

    def map_value(self, in_value):
        if in_value == 0:
            return "ON"
        else:
            return "OFF"

    def get_binary(self, in_str):
        return "".join(["{0:04b}".format(int(c, 16)) for c in in_str])

def on_connect(client, userdata, flags, rc):
    logging.info("Connected with result code " + str(rc))
    global mqtt_connected
    mqtt_connected = True

# Initialisierung:
try:
    # init Socket connection
    TCP_IP = '192.168.10.94'
    TCP_PORT = 8234

    BUFFER_SIZE = 4096
    result_str = ""
    time.sleep(.1)

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((TCP_IP, TCP_PORT))
    socket_list = [sys.stdin, s]


    result_str = ""
    client = mqtt.Client()
    client.on_connect = on_connect
    client.connect("vh-mqtt.home", 1883, 60)
    client.loop_start()
    time.sleep(.1)
    if mqtt_connected:
        oTelenot = Telenot()
        logging.debug("instance for Telenot created")
    while True:

        read_sockets, write_sockets, error_sockets = select.select(socket_list, [], [])

        for sock in read_sockets:
            if sock == s:
                data = sock.recv(BUFFER_SIZE)
                if not data:
                    print('\nDisconnected from server')
                    sys.exit()
                else:
                    result_str = result_str + str(binascii.hexlify(data).decode("ISO-8859-1"))
                    #result_str = result_str + data.encode("hex")
                    if result_str == SEND_NORM:
                        logging.debug("Result String:" + result_str)
                        logging.debug("Send CONF_ACK for SEND_NORM")
                        s.send(CONF_ACK)
                        result_str = ""
                    elif result_str == SEND_NORM_STR:
                        logging.debug("Result String:" + result_str)
                        logging.debug("Send CONF_ACK for SEND_NORM_STR")
                        s.send(CONF_ACK)
                        result_str = ""
                    elif re.match(SEND_NORM_REGEX, result_str):
                        #logging.debug("Result String:" + result_str)
                        #logging.debug("Send CONF_ACK for SEND_NORM_REGEX")
                        s.send(CONF_ACK)
                        result_str = ""
                    elif re.match(REGEX_MELDEBEREICHE, result_str):
                        logging.debug("Meldebereiche " + result_str)
                        oTelenot.set_meldebereiche(result_str)
                        s.send(CONF_ACK)
                        result_str = ""
                    elif re.match(REGEX_MELDEGRUPPEN, result_str):
                        logging.debug("Meldegruppen " + result_str)
                        mg1_str = binascii.unhexlify("ff")
                        mg2_str = binascii.unhexlify(result_str[26:28])
                        s.send(CONF_ACK)
                        result_str = ""
                    elif re.match(SEND_16, result_str):
                        logging.debug("Send CONF_ACK for $16" + result_str)
                        result_str = ""
                        s.send(CONF_ACK)
            else:     
                msg = sys.stdin.readline()
                #result_str = binascii.hexlify(msg).decode("ISO-8859-1")
                logging.debug("Error" + msg)
                #s.send(bytes(msg),ascii)
                sys.stdout.flush()

except Exception as e:
    logging.exception("message")


def _chunks(str, chunk_size):
    for i in xrange(0, len(str), chunk_size):
        yield str[i:i+chunk_size]

def from_str(str):
    for c in str:
        yield ord(c)

def to_str(ascii):
    return ''.join(chr(a) for a in ascii)

def from_bin(bin):
    for chunk in _chunks(bin, 8):
        yield int(chunk, 2)

def to_bin(ascii):
    return ''.join('{:08b}'.format(a) for a in ascii)

def from_hex(hex):
    for chunk in _chunks(hex, 2):
        yield int(chunk, 16)

def to_hex(ascii):
    return ''.join('{:02x}'.format(a) for a in ascii)
