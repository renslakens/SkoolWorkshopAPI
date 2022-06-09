USE skoolworkshop2;

DROP TABLE IF EXISTS DocentInOpdracht;
DROP TABLE IF EXISTS Doelgroep;
DROP TABLE IF EXISTS Opdracht;
DROP TABLE IF EXISTS Docent;
DROP TABLE IF EXISTS Medewerker;
DROP TABLE IF EXISTS Klant;
DROP TABLE IF EXISTS Locatie;
DROP TABLE IF EXISTS Workshop;

CREATE TABLE Docent (
	docentID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	emailadres varchar(25) NOT NULL UNIQUE,
	geboortedatum date NOT NULL DEFAULT CURRENT_TIMESTAMP,
	geboorteplaats varchar(25) NOT NULL DEFAULT " ",
	maxRijafstand int,
	heeftRijbewijs boolean,
	heeftAuto boolean,
	straat varchar(25) NOT NULL DEFAULT " ",
	huisnummer int NOT NULL DEFAULT 0,
	geslacht varchar(5) NOT NULL DEFAULT " ",
	nationaliteit varchar(15) NOT NULL DEFAULT " ",
	woonplaats varchar(15) NOT NULL DEFAULT " ",
	postcode varchar(8) NOT NULL DEFAULT " ",
	land varchar(25) NOT NULL DEFAULT " ",
	wachtwoord varchar(60) NOT NULL,
	isAccepted boolean DEFAULT FALSE,
	isFlexwerker boolean,
	PRIMARY KEY (docentID)
);

CREATE TABLE Medewerker (
	medewerkerID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	emailadres varchar(25) NOT NULL UNIQUE,
	wachtwoord varchar(60) NOT NULL,
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
	isBevestigd boolean,
	aantalDocenten int,
	locatieID int,
	workshopID int,
	/* klantID*/
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