USE MedicineBuddyDB;
 
USE MedicineBuddyDB;

/*---------------------------------------------------------------
Insert Data (UserMaster)
---------------------------------------------------------------*/
INSERT INTO MedicineBuddyDB.UserMaster (FirstName, LastName, UserName, PasswordEncrypted, RefreshToken, Age, Height, Weight, IsActive, CreatedBy, ModifiedBy)
VALUES
('Alice', 'Johnson', 'a1', 'a1', NULL, 30, 165.4, 60.5, TRUE, 1, 1),
('Bob', 'Smith', 'a2', 'a2', NULL, 45, 180.2, 80.3, TRUE, 1, 1),
('Charlie', 'Brown', 'charlieb', 'hashedpassword3', NULL, 50, 175.6, 78.4, TRUE, 1, 1),
('Diana', 'White', 'dianaw', 'hashedpassword4', NULL, 28, 160.8, 55.2, TRUE, 1, 1),
('Ethan', 'Black', 'ethanb', 'hashedpassword5', NULL, 35, 170.1, 72.5, TRUE, 1, 1);

/*---------------------------------------------------------------
Insert Data (DiseaseMaster)
---------------------------------------------------------------*/
INSERT INTO MedicineBuddyDB.DiseaseMaster (Title, Description, IsActive, CreatedBy, ModifiedBy)
VALUES
('Diabetes', 'A chronic disease that affects blood sugar regulation.', TRUE, 1, 1),
('Hypertension', 'A condition in which blood pressure is consistently high.', TRUE, 1, 1),
('Asthma', 'A respiratory condition causing difficulty in breathing.', TRUE, 1, 1),
('Arthritis', 'Inflammation of joints causing pain and stiffness.', TRUE, 1, 1),
('Depression', 'A mental health disorder characterized by persistent sadness.', TRUE, 1, 1);

/*---------------------------------------------------------------
Insert Data (SymptomMaster)
---------------------------------------------------------------*/
INSERT INTO MedicineBuddyDB.SymptomMaster (Title, Description, IsActive, CreatedBy, ModifiedBy)
VALUES
('Frequent Urination', 'Needing to urinate more often.', TRUE, 1, 1),
('High Blood Pressure', 'Abnormally high pressure in blood vessels.', TRUE, 1, 1),
('Shortness of Breath', 'Difficulty in normal breathing.', TRUE, 1, 1),
('Chest Pain', 'Discomfort or pain in the chest area.', TRUE, 1, 1),
('Joint Pain', 'Pain and stiffness in joints.', TRUE, 1, 1),
('Fatigue', 'Feeling extremely tired or exhausted.', TRUE, 1, 1),
('Headache', 'Pain in any region of the head.', TRUE, 1, 1),
('Mood Swings', 'Sudden changes in emotional state.', TRUE, 1, 1),
('Sleep Disorders', 'Difficulty falling or staying asleep.', TRUE, 1, 1),
('Weight Gain', 'Increase in body weight.', TRUE, 1, 1);

/*---------------------------------------------------------------
Insert Data (MedicineMaster)
---------------------------------------------------------------*/
INSERT INTO MedicineBuddyDB.MedicineMaster (Title, Description, IsActive, CreatedBy, ModifiedBy)
VALUES
('Metformin', '500 mg twice daily with meals.', TRUE, 1, 1),
('Lisinopril', '10 mg once daily.', TRUE, 1, 1),
('Albuterol', '2 puffs every 4-6 hours as needed.', TRUE, 1, 1),
('Ibuprofen', '400 mg every 6 hours as needed.', TRUE, 1, 1),
('Paracetamol', '500 mg every 4-6 hours for fever.', TRUE, 1, 1),
('Prednisone', '10 mg once daily for inflammation.', TRUE, 1, 1),
('Aspirin', '81 mg once daily for heart health.', TRUE, 1, 1),
('Insulin', 'Dosage as prescribed by doctor.', TRUE, 1, 1),
('Omeprazole', '20 mg once daily before meals.', TRUE, 1, 1),
('Sertraline', '50 mg once daily for depression.', TRUE, 1, 1);

/*---------------------------------------------------------------
Insert Data (DiseaseSymptomMapping)
Each disease has 2-3 symptoms mapped
---------------------------------------------------------------*/
INSERT INTO MedicineBuddyDB.DiseaseSymptomMapping (DiseaseId, SymptomId, IsActive, CreatedBy, ModifiedBy)
VALUES
(1, 1, TRUE, 1, 1), -- Diabetes -> Frequent Urination
(1, 10, TRUE, 1, 1), -- Diabetes -> Weight Gain

(2, 2, TRUE, 1, 1), -- Hypertension -> High Blood Pressure
(2, 4, TRUE, 1, 1), -- Hypertension -> Chest Pain
(2, 6, TRUE, 1, 1), -- Hypertension -> Fatigue

(3, 3, TRUE, 1, 1), -- Asthma -> Shortness of Breath
(3, 5, TRUE, 1, 1), -- Asthma -> Joint Pain

(4, 5, TRUE, 1, 1), -- Arthritis -> Joint Pain
(4, 6, TRUE, 1, 1), -- Arthritis -> Fatigue
(4, 7, TRUE, 1, 1), -- Arthritis -> Headache

(5, 8, TRUE, 1, 1), -- Depression -> Mood Swings
(5, 9, TRUE, 1, 1), -- Depression -> Sleep Disorders
(5, 10, TRUE, 1, 1); -- Depression -> Weight Gain

/*---------------------------------------------------------------
Insert Data (DiseaseMedicineMapping)
Each disease has 2-3 medicines mapped
---------------------------------------------------------------*/
INSERT INTO MedicineBuddyDB.DiseaseMedicineMapping (DiseaseId, MedicineId, IsActive, CreatedBy, ModifiedBy)
VALUES
(1, 1, TRUE, 1, 1), -- Diabetes -> Metformin
(1, 8, TRUE, 1, 1), -- Diabetes -> Insulin

(2, 2, TRUE, 1, 1), -- Hypertension -> Lisinopril
(2, 7, TRUE, 1, 1), -- Hypertension -> Aspirin

(3, 3, TRUE, 1, 1), -- Asthma -> Albuterol
(3, 4, TRUE, 1, 1), -- Asthma -> Ibuprofen

(4, 4, TRUE, 1, 1), -- Arthritis -> Ibuprofen
(4, 5, TRUE, 1, 1), -- Arthritis -> Paracetamol
(4, 6, TRUE, 1, 1), -- Arthritis -> Prednisone

(5, 9, TRUE, 1, 1), -- Depression -> Omeprazole
(5, 10, TRUE, 1, 1); -- Depression -> Sertraline


/*---------------------------------------------------------------
Insert Data (QuestionMaster)
---------------------------------------------------------------*/
INSERT INTO MedicineBuddyDB.QuestionMaster (Title, Description, IsActive, CreatedBy, ModifiedBy)
VALUES
('Do you experience fatigue?', 'Fatigue can be a symptom of multiple diseases.', TRUE, 1, 1),
('Do you have chest pain?', 'Chest pain may indicate cardiovascular problems.', TRUE, 1, 1),
('Are you experiencing skin rashes?', 'Skin rashes can be caused by allergies or infections.', TRUE, 1, 1),
('Do you suffer from headaches?', 'Headaches can be caused by migraines or stress.', TRUE, 1, 1),
('Do you have a fever?', 'Fever can indicate an infection or illness.', TRUE, 1, 1);

