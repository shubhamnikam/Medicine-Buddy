/*---------------------------------------------------------------
DB schema
---------------------------------------------------------------*/

-- create db
CREATE DATABASE IF NOT EXISTS MedicineBuddyDB;
USE MedicineBuddyDB;

/*---------------------------------------------------------------
master tables schema
---------------------------------------------------------------*/
-- create table: UserMaster
CREATE TABLE IF NOT EXISTS UserMaster (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    UserName VARCHAR(50) UNIQUE NOT NULL,
    PasswordEncrypted VARCHAR(255) NOT NULL,
    RefreshToken VARCHAR(255) NULL,
    Age INT NOT NULL,
    Height DECIMAL(5,2) NOT NULL,
    Weight DECIMAL(5,2) NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- create table: DiseaseMaster
CREATE TABLE IF NOT EXISTS DiseaseMaster (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- create table: SymptomMaster
CREATE TABLE IF NOT EXISTS SymptomMaster (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- create table: QuestionMaster
CREATE TABLE IF NOT EXISTS QuestionMaster (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- create table: MedicineMaster
CREATE TABLE IF NOT EXISTS MedicineMaster (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/*---------------------------------------------------------------
mapping tables schema
---------------------------------------------------------------*/
-- create mapping table: DiseaseSymptomMapping
CREATE TABLE IF NOT EXISTS DiseaseSymptomMapping (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DiseaseId INT NOT NULL,
    SymptomId INT NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_DiseaseSymptomMapping_disease FOREIGN KEY (DiseaseId) REFERENCES DiseaseMaster(Id) ON DELETE RESTRICT,
    CONSTRAINT fk_DiseaseSymptomMapping_symptom FOREIGN KEY (SymptomId) REFERENCES SymptomMaster(Id) ON DELETE RESTRICT,
    UNIQUE (DiseaseId, SymptomId) -- Ensures no duplicate mappings
);

-- create mapping table: DiseaseMedicineMapping
CREATE TABLE IF NOT EXISTS DiseaseMedicineMapping (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DiseaseId INT NOT NULL,
    MedicineId INT NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_DiseaseMedicineMapping_disease FOREIGN KEY (DiseaseId) REFERENCES DiseaseMaster(Id) ON DELETE RESTRICT,
    CONSTRAINT fk_DiseaseMedicineMapping_medicine FOREIGN KEY (MedicineId) REFERENCES MedicineMaster(Id) ON DELETE RESTRICT,
    UNIQUE (DiseaseId, MedicineId) -- Ensures no duplicate mappings
);

/*---------------------------------------------------------------
transaction tables schema
---------------------------------------------------------------*/
-- create table: UserDiseaseTransaction
CREATE TABLE IF NOT EXISTS UserDiseaseTransaction (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    DiseaseId INT NOT NULL,
    TransactionId VARCHAR(100) NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_UserDiseaseTransaction_user FOREIGN KEY (UserId) REFERENCES UserMaster(Id),
    CONSTRAINT fk_UserDiseaseTransaction_disease FOREIGN KEY (DiseaseId) REFERENCES DiseaseMaster(Id)
);

-- create table: UserQuestionTransaction
CREATE TABLE IF NOT EXISTS UserQuestionTransaction (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    QuestionId INT NOT NULL,
    Answer VARCHAR(300) NOT NULL,
    TransactionId VARCHAR(100) NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_UserQuestionTransaction_user FOREIGN KEY (UserId) REFERENCES UserMaster(Id),
    CONSTRAINT fk_UserQuestionTransaction_question FOREIGN KEY (QuestionId) REFERENCES QuestionMaster(Id)
);

-- create table: UserMedicineTransaction
CREATE TABLE IF NOT EXISTS UserMedicineTransaction (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    MedicineId INT NOT NULL,
    TransactionId VARCHAR(100) NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedBy INT NOT NULL,
    ModifiedBy INT NOT NULL,
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_UserMedicineTransaction_user FOREIGN KEY (UserId) REFERENCES UserMaster(Id),
    CONSTRAINT fk_UserMedicineTransaction_medicine FOREIGN KEY (MedicineId) REFERENCES MedicineMaster(Id)
);