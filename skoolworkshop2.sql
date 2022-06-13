USE skoolworkshop2;

DROP TABLE IF EXISTS DocentInOpdracht;
DROP TABLE IF EXISTS Doelgroep;
DROP TABLE IF EXISTS Opdracht;
DROP TABLE IF EXISTS Docent;
DROP TABLE IF EXISTS Medewerker;
DROP TABLE IF EXISTS Klant;
DROP TABLE IF EXISTS Locatie;
DROP TABLE IF EXISTS Workshop;
DROP TABLE IF EXISTS Login;
DROP TABLE IF EXISTS Rol;
DROP TABLE IF EXISTS RolInLogin;

CREATE TABLE Login (
	emailadres varchar(50) NOT NULL,
	wachtwoord varchar(60) NOT NULL,
	rol varchar(10) NOT NULL DEFAULT "docent",
	PRIMARY KEY (emailadres)
);

CREATE TABLE Docent (
	docentID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	geboortedatum date NOT NULL DEFAULT CURRENT_DATE,
	geboorteplaats varchar(25) NOT NULL DEFAULT " ",
	maxRijafstand int DEFAULT 0,
	heeftRijbewijs boolean DEFAULT FALSE,
	heeftAuto boolean DEFAULT FALSE,
	straat varchar(25) NOT NULL DEFAULT " ",
	huisnummer int NOT NULL DEFAULT 0,
	geslacht varchar(5) NOT NULL DEFAULT " ",
	nationaliteit varchar(15) NOT NULL DEFAULT " ",
	woonplaats varchar(15) NOT NULL DEFAULT " ",
	postcode varchar(8) NOT NULL DEFAULT " ",
	land varchar(25) NOT NULL DEFAULT " ",
	isAccepted boolean DEFAULT FALSE,
	isFlexwerker boolean DEFAULT FALSE,
	loginEmail varchar(50) NOT NULL,
	PRIMARY KEY (docentID),
	FOREIGN KEY (loginEmail) REFERENCES Login(emailadres)
);

CREATE TABLE Medewerker (
	medewerkerID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	loginEmail varchar(50) NOT NULL,
	PRIMARY KEY (medewerkerID),
	FOREIGN KEY (loginEmail) REFERENCES Login(emailadres)
);

CREATE TABLE Klant (
	klantID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	postcode varchar(8) NOT NULL,
	telefoonnummer varchar(10) NOT NULL,
	straat varchar(25) NOT NULL,
	huisnummer varchar(5) NOT NULL,
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
	beschrijving varchar(250),
	PRIMARY KEY (workshopID)
);

CREATE TABLE Opdracht (
	opdrachtID int NOT NULL AUTO_INCREMENT,
	aantalDocenten int,
	salarisIndicatie int,
	startTijd datetime,
	eindTijd datetime,
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
	isBevestigd boolean DEFAULT FALSE,
	docentID int,
	opdrachtID int,
	FOREIGN KEY (docentID) REFERENCES Docent(docentID),
	FOREIGN KEY (opdrachtID) REFERENCES Opdracht(opdrachtID),
    CONSTRAINT PK_DocentInOpdracht PRIMARY KEY (docentID,OpdrachtID)
);