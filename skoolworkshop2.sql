USE skool2extra;

DROP TABLE IF EXISTS Docent;
DROP TABLE IF EXISTS Medewerker;
DROP TABLE IF EXISTS Klant;
DROP TABLE IF EXISTS Locatie;
DROP TABLE IF EXISTS Workshop;
DROP TABLE IF EXISTS Opdracht;
DROP TABLE IF EXISTS Doelgroep;
DROP TABLE IF EXISTS DocentInOpdracht;

CREATE TABLE Docent (
	docentID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	emailadres varchar(25) NOT NULL UNIQUE,
	geboortedatum date NOT NULL,
	geboorteplaats varchar(25) NOT NULL,
	maxRijafstand int,
	heeftRijbewijs int,
	heeftAuto int,
	straat varchar(25) NOT NULL,
	huisnummer int NOT NULL,
	geslacht varchar(5) NOT NULL,
	nationaliteit varchar(15) NOT NULL,
	woonplaats varchar(15) NOT NULL,
	postcode varchar(8) NOT NULL,
	land varchar(25) NOT NULL,
	wachtwoord varchar(50) NOT NULL,
	isAccepted int,
	isFlexwerker int,
	PRIMARY KEY (docentID)
);

CREATE TABLE Medewerker (
	medewerkerID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	emailadres varchar(25) NOT NULL UNIQUE,
	wachtwoord varchar(50) NOT NULL,
	soortMedewerker varchar(10) NOT NULL,
	PRIMARY KEY (medewerkerID)
);

CREATE TABLE Klant (
	klantID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	postcode varchar(8) NOT NULL,
	telefoonnummer varchar(10) NOT NULL,
	straat varchar(25) NOT NULL,
	huisnummer int NOT NULL,
	plaats varchar(25) NOT NULL,
	klantType varchar(25),
	land varchar(25) NOT NULL,
	naamContactpersoon varchar(50) NOT NULL,
	PRIMARY KEY (klantID)
);

CREATE TABLE Locatie (
	locatieID int NOT NULL AUTO_INCREMENT,
	naam varchar(50),
	land varchar(25) NOT NULL,
	postcode varchar(8),
	straat varchar(25),
	huisnummer int,
	plaats varchar(25) NOT NULL,
	PRIMARY KEY (locatieID)
);

CREATE TABLE Workshop (
	workshopID int NOT NULL AUTO_INCREMENT,
	naam varchar(50),
	salarisindicatie decimal(2,1),
	beschrijving varchar(250),
	PRIMARY KEY (workshopID)
);

CREATE TABLE Opdracht (
	opdrachtID int NOT NULL AUTO_INCREMENT,
	isBevestigd int,
	aantalDocenten int,
	locatieID int,
	workshopID int,
	PRIMARY KEY (opdrachtID),
	FOREIGN KEY (locatieID) REFERENCES Locatie(locatieID),
	FOREIGN KEY (workshopID) REFERENCES Workshop(workshopID)
);

CREATE TABLE Doelgroep (
	docentID int,
	workshopID int,
	FOREIGN KEY (docentID) REFERENCES Docent(docentID),
	FOREIGN KEY (workshopID) REFERENCES Workshop(workshopID)
);

CREATE TABLE DocentInOpdracht (
	docentID int,
	opdrachtID int,
	FOREIGN KEY (docentID) REFERENCES Docent(docentID),
	FOREIGN KEY (opdrachtID) REFERENCES Opdracht(opdrachtID),
    CONSTRAINT PK_DocentInOpdracht PRIMARY KEY (docentID,OpdrachtID)
);