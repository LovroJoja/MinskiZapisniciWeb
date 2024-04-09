import sqlite3
import csv
import os
from IPython.display import display, Image

path = 'C:\\Users\\lovro\\OneDrive\\Radna površina\\DIPL\\Skice'
def read_csv_as_list_of_dicts(file_path):
    data_list = []
    with open(file_path, 'r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data_list.append(dict(row))
    return data_list

file_path = 'Blinjski_Kut_MFR.csv'
data_list_of_dicts = read_csv_as_list_of_dicts(file_path)

class Zapisnik():

	def __init__(self, ID, GKZona, GKE, GKN, UNSektor, OznakaUN, Oznaka, Zupanija, Opcina, Naselje, VojskaID, date, POM, PPM, Ostala, Provjere, TipPolja):
		self.id = ID
		self.gkzona = GKZona
		self.gkn = GKN
		self.gke = GKE
		self.unsektor = UNSektor
		self.oznakaUN = OznakaUN
		self.oznaka = Oznaka
		self.zupanija = Zupanija
		self.opcina = Opcina
		self.naselje = Naselje
		self.vojskaid = VojskaID
		self.date = date
		self.pom = POM
		self.ppm = PPM
		self.ostala = Ostala
		self.provjere = provjere
		self.tippolja = TipPolja
		


conn = sqlite3.connect('zapisnici.db')

#conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.execute("""CREATE TABLE Zapisnici (
	ID integer PRIMARY KEY,
	GKZona integer,
	GKN integer,
	GKE integer,
	UNSektor text,
	OznakaUN integer,
	Oznaka integer,
	Županija text,
	Općina text,
	Naselje text,
	VojskaID text,
	Datum text,
	POM integer,
	PPM integer,
	Ostala integer,
	Provjere integer,
	TipPolja text
	

	)""")
for zapisnik in data_list_of_dicts:
	#print(zapisnik)
	#skica = find_image(zapisnik["LINK"])
	with conn:
		c.execute("INSERT INTO Zapisnici VALUES (:ID,:GKZona,:GKN,:GKE,:UNSektor,:OznakaUN,:Oznaka,:Županija,:Općina,:Naselje,:VojskaID,:Datum,:POM,:PPM,:Ostala,:Provjere,:TipPolja)",
			{"ID": zapisnik["LINK"], "GKZona": zapisnik["MZGKZONA"],"GKE": zapisnik["MZGKE"],"GKN": zapisnik["MZGKN"],
			"UNSektor": zapisnik["UNSEKTOR"],"OznakaUN": zapisnik["MZOZNAKAUN"],"Oznaka": zapisnik["MZOZNAKA"],
			"Županija": zapisnik["MZZUPANIJA"],"Općina": zapisnik["OPCINA"],"Naselje": zapisnik["NASELJE"],
			"VojskaID": zapisnik["MZVOJSKAID"],"Datum": zapisnik["MZDATUM"],"POM": zapisnik["POM"],"PPM": zapisnik["PPM"],
			"Ostala": zapisnik["OSTALA"],"Provjere": zapisnik["MZPROVJERE"],"TipPolja": zapisnik["TIP_POLJA"]})

c.execute("SELECT * FROM Zapisnici WHERE ID=30706")
print(c.fetchall())
#record = c.fetchone()


conn.close()
