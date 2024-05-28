import sqlite3
import csv
import os
#from IPython.display import display, Image

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




c.execute("""CREATE TABLE Županije (
	ID integer PRIMARY KEY,
	Naziv text,
	Kratica text	

	)""")

c.execute("""CREATE TABLE Općine (
	ID integer PRIMARY KEY,
	Naziv text,
	ŽupanijaKey integer	

	)""")

c.execute("""CREATE TABLE Naselja (
	ID integer PRIMARY KEY,
	Naziv text,
	OpćinaKey integer
	ŽupanijaKey integer	

	)""")

#vrhovi zapisani u obliku xCoord/yCoord-xCoord/yCoord-...
#prvo split po "-" za vrhove onda split po "/" za koordinate vrhova 
c.execute("""CREATE TABLE Polja (
	ID integer PRIMARY KEY AUTOINCREMENT,
	RecordID integer,
	Vrhovi text,
	Operacija text,
	Opis text,
	Color text	

	)""")
#c.execute("INSERT INTO Polja VALUES (:ID, :RecordID, :Vrhovi, :Akcija)", {"ID": 1, "RecordID": 30706, "Vrhovi": "45.1|16.1-45.15|16.15-45.15|16.2-45.1|16.1", "Akcija": "Cleared"})
#45.1|16.1-45.15|16.15-45.15|16.2-45.1|16.1



c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 1, "Naziv": "Međimurska", "Kratica": "MM"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 2, "Naziv": "Virovitičko-Podravksa", "Kratica": "VP"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 3, "Naziv": "Koprivničko-Križevačka", "Kratica": "KK"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 4, "Naziv": "Osječko-Baranjska", "Kratica": "OB"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 5, "Naziv": "Istarska", "Kratica": "IS"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 6, "Naziv": "Dubrovačko-Neretvanska", "Kratica": "DN"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 7, "Naziv": "Sisačko-Moslavačka", "Kratica": "SM"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 8, "Naziv": "Brodsko-Posavska", "Kratica": "BP"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 9, "Naziv": "Karlovačka", "Kratica": "KR"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 10, "Naziv": "Zadarska", "Kratica": "ZD"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 11, "Naziv": "Vukovarsko-Srijemska", "Kratica": "VS"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 12, "Naziv": "Splitsko-Dalmatinska", "Kratica": "SD"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 13, "Naziv": "Varaždinska", "Kratica": "VŽ"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 14, "Naziv": "Krapinsko-Zagorska", "Kratica": "KZ"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 15, "Naziv": "Zagrebačka", "Kratica": "ZG"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 16, "Naziv": "Primorsko-Goranska", "Kratica": "PG"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 17, "Naziv": "Šibensko-Kninska", "Kratica": "ŠK"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 18, "Naziv": "Ličko-Senjska", "Kratica": "LS"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 19, "Naziv": "Međimurska", "Kratica": "BB"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 20, "Naziv": "Grad Zagreb", "Kratica": "GZ"})
c.execute("INSERT INTO Županije VALUES (:ID, :Naziv, :Kratica)", {"ID": 21, "Naziv": "Požeško-Slavonska", "Kratica": "PS"})
conn.commit()
c.execute("SELECT * FROM Županije")
print(c.fetchall())




conn.close()
