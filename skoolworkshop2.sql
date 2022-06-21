USE skoolworkshop2;

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS Medewerker;
DROP TABLE IF EXISTS DocentInOpdracht;
DROP TABLE IF EXISTS WorkshopDocent;
DROP TABLE IF EXISTS DoelgroepDocent;
DROP TABLE IF EXISTS Docent;
DROP TABLE IF EXISTS Opdracht;
DROP TABLE IF EXISTS Klant;
DROP TABLE IF EXISTS Locatie;
DROP TABLE IF EXISTS Doelgroep;
DROP TABLE IF EXISTS Workshop;
DROP TABLE IF EXISTS Login;

CREATE TABLE Login (
	emailadres varchar(50) NOT NULL,
	wachtwoord varchar(60) NOT NULL,
	rol varchar(10) NOT NULL DEFAULT "Docent",
	isAccepted boolean DEFAULT FALSE,
	PRIMARY KEY (emailadres)
);

CREATE TABLE Docent (
	docentID int NOT NULL AUTO_INCREMENT,
	voornaam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	geboortedatum date NOT NULL,
	geboorteplaats varchar(25) NOT NULL,
	maxRijafstand int,
	heeftRijbewijs boolean,
	heeftAuto boolean,
	straat varchar(25) NOT NULL,
	huisnummer int NOT NULL,
	geslacht varchar(5) NOT NULL,
	woonplaats varchar(15) NOT NULL,
	postcode varchar(8) NOT NULL,
	land varchar(25) NOT NULL,
	isFlexwerker boolean,
	loginEmail varchar(50) NOT NULL,
	telefoonnummer varchar(10) NOT NULL,
	PRIMARY KEY (docentID),
	FOREIGN KEY (loginEmail) REFERENCES Login(emailadres) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Medewerker (
	medewerkerID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	achternaam varchar(25) NOT NULL,
	loginEmail varchar(50) NOT NULL,
	PRIMARY KEY (medewerkerID),
	FOREIGN KEY (loginEmail) REFERENCES Login(emailadres) ON DELETE CASCADE ON UPDATE CASCADE
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
	huisnummer varchar(5) NOT NULL,
	plaats varchar(25) NOT NULL,
	PRIMARY KEY (locatieID)
);

CREATE TABLE Workshop (
	workshopID int NOT NULL AUTO_INCREMENT,
	naam varchar(50),
	beschrijving varchar(250),
	PRIMARY KEY (workshopID)
);

CREATE TABLE Doelgroep (
	doelgroepID int NOT NULL AUTO_INCREMENT,
	doelgroep varchar(25) NOT NULL,
	PRIMARY KEY (doelgroepID)
);

CREATE TABLE Opdracht (
	opdrachtID int NOT NULL AUTO_INCREMENT,
	aantalDocenten int,
	salarisIndicatie int,
	startTijd datetime,
	eindTijd datetime,
	locatieID int,
	workshopID int,
	klantID int,
	doelgroepID int,
	PRIMARY KEY (opdrachtID),
	FOREIGN KEY (locatieID) REFERENCES Locatie(locatieID),
	FOREIGN KEY (workshopID) REFERENCES Workshop(workshopID),
	FOREIGN KEY (klantID) REFERENCES Klant(KlantID),
	FOREIGN KEY (doelgroepID) REFERENCES Doelgroep(doelgroepID)
);

CREATE TABLE WorkshopDocent (
	docentID int,
	workshopID int,
	FOREIGN KEY (docentID) REFERENCES Docent(docentID),
	FOREIGN KEY (workshopID) REFERENCES Workshop(workshopID)
);

CREATE TABLE DoelgroepDocent (
	docentID int,
	doelgroepID int,
	FOREIGN KEY (docentID) REFERENCES Docent(docentID),
	FOREIGN KEY (doelgroepID) REFERENCES doelgroep(doelgroepID)
);

CREATE TABLE DocentInOpdracht (
	isBevestigd boolean DEFAULT FALSE,
	docentID int,
	opdrachtID int,
	FOREIGN KEY (docentID) REFERENCES Docent(docentID),
	FOREIGN KEY (opdrachtID) REFERENCES Opdracht(opdrachtID),
	CONSTRAINT PK_DocentInOpdracht PRIMARY KEY (docentID,OpdrachtID)
);

SET FOREIGN_KEY_CHECKS=1;