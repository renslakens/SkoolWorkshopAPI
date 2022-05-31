USE skoolworkshop2;

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
	PRIMARY KEY (medewerkerID)
);

CREATE TABLE Klant (
	klantID int NOT NULL AUTO_INCREMENT,
	naam varchar(25) NOT NULL,
	postcode varchar(8) NOT NULL,
	telefoonnummer varchar(10) NOT NULL UNIQUE,
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
	locatieNaam varchar(50),
	workshopNaam varchar(50),
	PRIMARY KEY (opdrachtID),
	FOREIGN KEY (locatieNaam) REFERENCES Locatie(naam),
	FOREIGN KEY (workshopNaam) REFERENCES Workshop(naam)
);

CREATE TABLE Doelgroep (
	docentEmail varchar(25),
	workshopNaam varchar(50),
	FOREIGN KEY (docentEmail) REFERENCES Docent(emailadres),
	FOREIGN KEY (workshopNaam) REFERENCES Workshop(naam)
);

CREATE TABLE DocentInOpdracht (
	docentEmail varchar(25),
	opdrachtID int,
	FOREIGN KEY (docentEmail) REFERENCES Docent(emailadres),
	FOREIGN KEY (opdrachtID) REFERENCES Opdracht(opdrachtID),
    CONSTRAINT PK_DocentInOpdracht PRIMARY KEY (docentEmail,OpdrachtID)
);