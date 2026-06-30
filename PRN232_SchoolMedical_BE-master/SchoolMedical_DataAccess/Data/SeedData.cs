using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.Data
{
    public static class SeedData
    {
        /*
        private static readonly Random _random = new Random();

        public static async Task SeedAsync(SchoolhealthdbContext context)
        {
            // Clear existing data in correct order (respecting foreign key constraints)
            await ClearDataAsync(context);

            // Seed data in correct order
            await SeedAccountsAsync(context);
            await SeedMedicinesAsync(context);
            await SeedMedicalSuppliesAsync(context);
            await SeedMedicineRequestsAsync(context);
            await SeedStudentHealthRecordsAsync(context);
            await SeedIncidentRecordsAsync(context);
            await SeedTreatmentRecordsAsync(context);
            await SeedVaccineRecordsAsync(context);
            await SeedHealthCheckupEventsAsync(context);
            await SeedVaccineEventsAsync(context);

            await context.SaveChangesAsync();
        }

        private static async Task ClearDataAsync(SchoolhealthdbContext context)
        {
            // Clear data in reverse dependency order
            context.Vaccinerecords.RemoveRange(context.Vaccinerecords);
            context.Treatmentrecords.RemoveRange(context.Treatmentrecords);
            context.Vaccineevents.RemoveRange(context.Vaccineevents);
            context.Healthcheckupevents.RemoveRange(context.Healthcheckupevents);
            context.Incidentrecords.RemoveRange(context.Incidentrecords);
            context.Studenthealthrecords.RemoveRange(context.Studenthealthrecords);
            context.Medicinerequests.RemoveRange(context.Medicinerequests);
            context.Medicalsupplies.RemoveRange(context.Medicalsupplies);
            context.Medicines.RemoveRange(context.Medicines);
            context.Accounts.RemoveRange(context.Accounts);

            await context.SaveChangesAsync();
        }

        private static async Task SeedAccountsAsync(SchoolhealthdbContext context)
        {
            var accounts = new List<Account>();

            // Admin accounts
            accounts.Add(new Account
            {
                Id = "admin-001",
                FullName = "Dr. Sarah Johnson",
                Email = "admin@school.edu",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                PhoneNumber = "555-0101",
                Role = "Admin",
                Address = "123 School Admin Building",
                Status = AccountStatus.Active.ToString()
            });

            accounts.Add(new Account
            {
                Id = "admin-002",
                FullName = "Dr. Michael Chen",
                Email = "michael.chen@school.edu",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                PhoneNumber = "555-0102",
                Role = "Admin",
                Address = "124 Medical Office",
                Status = AccountStatus.Active.ToString()
            });

            // Nurse accounts
            accounts.Add(new Account
            {
                Id = "nurse-001",
                FullName = "Nurse Emily Wilson",
                Email = "emily.wilson@school.edu",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                PhoneNumber = "555-0201",
                Role = "SchoolNurse",
                Address = "Health Center Room 101",
                Status = AccountStatus.Active.ToString()
            });

            accounts.Add(new Account
            {
                Id = "nurse-002",
                FullName = "Nurse Robert Davis",
                Email = "robert.davis@school.edu",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                PhoneNumber = "555-0202",
                Role = "SchoolNurse",
                Address = "Health Center Room 102",
                Status = AccountStatus.Active.ToString()
            });

            // Teacher accounts
            var teacherData = new[]
            {
                new { Name = "Ms. Jennifer Martinez", Email = "j.martinez@edu" },
                new { Name = "Mr. David Brown", Email = "d.brown@edu" },
                new { Name = "Ms. Lisa Anderson", Email = "l.anderson@edu" },
                new { Name = "Mr. James Taylor", Email = "j.taylor@edu" },
                new { Name = "Ms. Patricia Moore", Email = "p.moore@edu" },
                new { Name = "Mr. Christopher Lee", Email = "c.lee@edu" }
            };

            for (int i = 0; i < teacherData.Length; i++)
            {
                accounts.Add(new Account
                {
                    Id = $"teacher-{(i + 1):D3}",
                    FullName = teacherData[i].Name,
                    Email = teacherData[i].Email,
                    Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                    PhoneNumber = $"555-0{300 + i}",
                    Role = "Teacher",
                    Address = $"Classroom Building {i + 1}",
                    Status = AccountStatus.Active.ToString()
                });
            }

            // Parent accounts
            var parentData = new[]
            {
                new { Name = "John Smith", Email = "j.smith@email.com" },
                new { Name = "Mary Johnson", Email = "m.johnson@email.com" },
                new { Name = "Robert Williams", Email = "r.williams@email.com" },
                new { Name = "Linda Brown", Email = "l.brown@email.com" },
                new { Name = "Michael Davis", Email = "m.davis@email.com" },
                new { Name = "Elizabeth Miller", Email = "e.miller@email.com" },
                new { Name = "William Wilson", Email = "w.wilson@email.com" },
                new { Name = "Barbara Moore", Email = "b.moore@email.com" },
                new { Name = "Richard Taylor", Email = "r.taylor@email.com" },
                new { Name = "Susan Anderson", Email = "s.anderson@email.com" },
                new { Name = "Thomas Jackson", Email = "t.jackson@email.com" },
                new { Name = "Jessica White", Email = "j.white@email.com" }
            };

            for (int i = 0; i < parentData.Length; i++)
            {
                accounts.Add(new Account
                {
                    Id = $"parent-{(i + 1):D3}",
                    FullName = parentData[i].Name,
                    Email = parentData[i].Email,
                    Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                    PhoneNumber = $"555-0{400 + i}",
                    Role = "Parent",
                    Address = $"{100 + i} Main Street, City",
                    Status = AccountStatus.Active.ToString()
                });
            }

            // Student accounts (children of parents)
            var studentData = new[]
            {
                new { Name = "Alex Smith", Email = "alex.s@student.edu" },
                new { Name = "Emma Johnson", Email = "emma.j@student.edu" },
                new { Name = "Liam Williams", Email = "liam.w@student.edu" },
                new { Name = "Olivia Brown", Email = "olivia.b@student.edu" },
                new { Name = "Noah Davis", Email = "noah.d@student.edu" },
                new { Name = "Ava Miller", Email = "ava.m@student.edu" },
                new { Name = "Ethan Wilson", Email = "ethan.w@student.edu" },
                new { Name = "Sophia Moore", Email = "sophia.m@student.edu" },
                new { Name = "Mason Taylor", Email = "mason.t@student.edu" },
                new { Name = "Isabella Anderson", Email = "bella.a@student.edu" },
                new { Name = "Logan Jackson", Email = "logan.j@student.edu" },
                new { Name = "Mia White", Email = "mia.w@student.edu" },
                new { Name = "Lucas Garcia", Email = "lucas.g@student.edu" },
                new { Name = "Charlotte Martinez", Email = "char.m@student.edu" },
                new { Name = "Oliver Rodriguez", Email = "oli.r@student.edu" },
                new { Name = "Amelia Lopez", Email = "amy.l@student.edu" },
                new { Name = "Elijah Gonzalez", Email = "eli.g@student.edu" },
                new { Name = "Harper Perez", Email = "harper.p@student.edu" },
                new { Name = "James Robinson", Email = "james.r@student.edu" },
                new { Name = "Evelyn Clark", Email = "eve.c@student.edu" }
            };

            for (int i = 0; i < studentData.Length; i++)
            {
                var parentId = i < parentData.Length ? $"parent-{(i + 1):D3}" : null;

                accounts.Add(new Account
                {
                    Id = $"student-{(i + 1):D3}",
                    ParentId = parentId,
                    FullName = studentData[i].Name,
                    Email = studentData[i].Email,
                    Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                    PhoneNumber = $"555-0{500 + i}",
                    Role = "Student",
                    Address = parentId != null ? $"{100 + i} Main Street, City" : $"{200 + i} Dormitory Lane",
                    Status = AccountStatus.Active.ToString()
                });
            }

            context.Accounts.AddRange(accounts);
            await context.SaveChangesAsync();
        }

        private static async Task SeedMedicinesAsync(SchoolhealthdbContext context)
        {
            var adminIds = context.Accounts.Where(a => a.Role == "Admin").Select(a => a.Id).ToList();
            var nurseIds = context.Accounts.Where(a => a.Role == "SchoolNurse").Select(a => a.Id).ToList();
            var creatorIds = adminIds.Concat(nurseIds).ToList();

            var medicines = new[]
            {
                new { Name = "Paracetamol 500mg", Description = "Pain reliever and fever reducer", Amount = 100 },
                new { Name = "Ibuprofen 200mg", Description = "Anti-inflammatory pain reliever", Amount = 75 },
                new { Name = "Aspirin 325mg", Description = "Pain reliever and blood thinner", Amount = 50 },
                new { Name = "Acetaminophen", Description = "Fever reducer and pain reliever", Amount = 120 },
                new { Name = "Diphenhydramine", Description = "Antihistamine for allergies", Amount = 60 },
                new { Name = "Loratadine", Description = "Non-drowsy antihistamine", Amount = 80 },
                new { Name = "Cetirizine", Description = "Allergy relief medication", Amount = 90 },
                new { Name = "Pseudoephedrine", Description = "Nasal decongestant", Amount = 40 },
                new { Name = "Dextromethorphan", Description = "Cough suppressant", Amount = 65 },
                new { Name = "Guaifenesin", Description = "Expectorant for chest congestion", Amount = 55 },
                new { Name = "Simethicone", Description = "Anti-gas medication", Amount = 45 },
                new { Name = "Loperamide", Description = "Anti-diarrheal medication", Amount = 30 },
                new { Name = "Oral Rehydration Salts", Description = "Electrolyte replacement", Amount = 25 },
                new { Name = "Calamine Lotion", Description = "Topical anti-itch treatment", Amount = 35 },
                new { Name = "Hydrocortisone Cream", Description = "Topical anti-inflammatory", Amount = 40 }
            };

            var medicineEntities = medicines.Select((med, index) => new Medicine
            {
                Id = $"med-{(index + 1):D3}",
                Name = med.Name,
                Description = med.Description,
                Amount = med.Amount,
                IsAvailable = _random.Next(0, 10) > 1, // 90% chance of being available
                CreatedBy = creatorIds[_random.Next(creatorIds.Count)],
                IsDeleted = _random.Next(0, 20) == 0, // 5% chance of being deleted
            }).ToList();

            context.Medicines.AddRange(medicineEntities);
            await context.SaveChangesAsync();
        }

        private static async Task SeedMedicalSuppliesAsync(SchoolhealthdbContext context)
        {
            var adminIds = context.Accounts.Where(a => a.Role == "Admin").Select(a => a.Id).ToList();
            var nurseIds = context.Accounts.Where(a => a.Role == "SchoolNurse").Select(a => a.Id).ToList();
            var creatorIds = adminIds.Concat(nurseIds).ToList();

            var supplies = new[]
            {
                new { Name = "Bandages", Description = "Sterile adhesive bandages", Amount = 200 },
                new { Name = "Gauze Pads", Description = "Sterile gauze pads 4x4", Amount = 150 },
                new { Name = "Medical Tape", Description = "Hypoallergenic medical tape", Amount = 50 },
                new { Name = "Antiseptic Wipes", Description = "Alcohol-based antiseptic wipes", Amount = 300 },
                new { Name = "Thermometers", Description = "Digital thermometers", Amount = 15 },
                new { Name = "Disposable Gloves", Description = "Latex-free disposable gloves", Amount = 500 },
                new { Name = "Ice Packs", Description = "Instant cold compress packs", Amount = 75 },
                new { Name = "Cotton Swabs", Description = "Sterile cotton swabs", Amount = 100 },
                new { Name = "Hydrogen Peroxide", Description = "3% hydrogen peroxide solution", Amount = 25 },
                new { Name = "Saline Solution", Description = "Sterile saline wound wash", Amount = 30 }
            };

            var supplyEntities = supplies.Select((supply, index) => new Medicalsupply
            {
                Id = $"supply-{(index + 1):D3}",
                Name = supply.Name,
                Description = supply.Description,
                Amount = supply.Amount,
                IsAvailable = _random.Next(0, 10) > 0, // 95% chance of being available
                CreatedBy = creatorIds[_random.Next(creatorIds.Count)],
                IsDeleted = _random.Next(0, 25) == 0, // 4% chance of being deleted
            }).ToList();

            context.Medicalsupplies.AddRange(supplyEntities);
            await context.SaveChangesAsync();
        }

        private static async Task SeedMedicineRequestsAsync(SchoolhealthdbContext context)
        {
            var teacherIds = context.Accounts.Where(a => a.Role == "Teacher").Select(a => a.Id).ToList();
            var studentIds = context.Accounts.Where(a => a.Role == "Student").Select(a => a.Id).ToList();
            var parentIds = context.Accounts.Where(a => a.Role == "Parent").Select(a => a.Id).ToList();

            var requesters = teacherIds.Concat(parentIds).ToList();

            var descriptions = new[]
            {
                "Student has a headache and needs pain relief",
                "Allergic reaction symptoms, needs antihistamine",
                "Fever and body aches, requesting fever reducer",
                "Upset stomach, needs anti-nausea medication",
                "Minor cut, needs antiseptic and bandage",
                "Cough and congestion, needs cough suppressant",
                "Migraine symptoms, needs strong pain reliever",
                "Bee sting reaction, needs antihistamine urgently"
            };

            var requests = new List<Medicinerequest>();

            for (int i = 0; i < 25; i++)
            {
                requests.Add(new Medicinerequest
                {
                    Id = $"req-{(i + 1):D3}",
                    RequestBy = requesters[_random.Next(requesters.Count)],
                    ForStudent = studentIds[_random.Next(studentIds.Count)],
                    Description = descriptions[_random.Next(descriptions.Length)],
                    DateSent = DateTime.Now.AddDays(-_random.Next(0, 30)).AddHours(-_random.Next(0, 24)),
                    Status = _random.Next(0, 4) switch
                    {
                        0 => RequestStatus.Pending.ToString(),
                        1 => RequestStatus.Approved.ToString(),
                        2 => RequestStatus.Rejected.ToString(),
                        _ => RequestStatus.Deleted.ToString()
                    }
                });
            }

            context.Medicinerequests.AddRange(requests);
            await context.SaveChangesAsync();
        }

        private static async Task SeedStudentHealthRecordsAsync(SchoolhealthdbContext context)
        {
            var studentIds = context.Accounts.Where(a => a.Role == "Student").Select(a => a.Id).ToList();
            var nurseIds = context.Accounts.Where(a => a.Role == "SchoolNurse").Select(a => a.Id).ToList();

            var allergies = new[]
            {
                "Peanuts, Tree nuts", "Dairy products", "Shellfish", "Pollen, Dust mites",
                "No known allergies", "Latex", "Penicillin", "Bee stings", "Eggs"
            };

            var chronicDiseases = new[]
            {
                "None", "Asthma", "Type 1 Diabetes", "ADHD", "Epilepsy", "None recorded"
            };

            var visionStatus = new[]
            {
                "Normal", "Myopia (Nearsighted)", "Hyperopia (Farsighted)", "Astigmatism", "Corrected with glasses"
            };

            var hearingStatus = new[]
            {
                "Normal", "Mild hearing loss", "Normal hearing", "Hearing aid required"
            };

            var healthRecords = studentIds.Select((studentId, index) => new Studenthealthrecord
            {
                Id = $"health-{(index + 1):D3}",
                StudentId = studentId,
                CreatedBy = nurseIds[_random.Next(nurseIds.Count)],
                Height = _random.Next(120, 180), // Height in cm
                Allergies = allergies[_random.Next(allergies.Length)],
                ChronicDiseases = chronicDiseases[_random.Next(chronicDiseases.Length)],
                Vision = visionStatus[_random.Next(visionStatus.Length)],
                Hearing = hearingStatus[_random.Next(hearingStatus.Length)],
                Status = RecordStatus.Active.ToString()
            }).ToList();

            context.Studenthealthrecords.AddRange(healthRecords);
            await context.SaveChangesAsync();
        }

        private static async Task SeedIncidentRecordsAsync(SchoolhealthdbContext context)
        {
            var studentIds = context.Accounts.Where(a => a.Role == "Student").Select(a => a.Id).ToList();
            var nurseIds = context.Accounts.Where(a => a.Role == "SchoolNurse").Select(a => a.Id).ToList();
            var teacherIds = context.Accounts.Where(a => a.Role == "Teacher").Select(a => a.Id).ToList();

            var handlers = nurseIds.Concat(teacherIds).ToList();

            var incidentTypes = new[]
            {
                "Minor Injury", "Allergic Reaction", "Illness", "Accident", "Emergency", "Behavioral"
            };

            var descriptions = new[]
            {
                "Student fell during recess and scraped knee",
                "Allergic reaction to food in cafeteria",
                "Student felt dizzy during PE class",
                "Minor cut from art class scissors",
                "Nosebleed during math class",
                "Stomach ache after lunch",
                "Headache complaint during English",
                "Bee sting during outdoor activity"
            };

            var incidents = new List<Incidentrecord>();

            for (int i = 0; i < 30; i++)
            {
                incidents.Add(new Incidentrecord
                {
                    Id = $"incident-{(i + 1):D3}",
                    StudentId = studentIds[_random.Next(studentIds.Count)],
                    HandleBy = handlers[_random.Next(handlers.Count)],
                    IncidentType = incidentTypes[_random.Next(incidentTypes.Length)],
                    Description = descriptions[_random.Next(descriptions.Length)],
                    DateOccurred = DateTime.Now.AddDays(-_random.Next(0, 60)).AddHours(-_random.Next(0, 24)),
                    Status = RecordStatus.Active.ToString()
                });
            }

            context.Incidentrecords.AddRange(incidents);
            await context.SaveChangesAsync();
        }

        private static async Task SeedTreatmentRecordsAsync(SchoolhealthdbContext context)
        {
            var healthRecords = context.Studenthealthrecords.ToList();
            var studentIds = healthRecords.Select(h => h.StudentId).ToList();

            var treatments = new[]
            {
                "Rest and hydration", "Ice pack application", "Bandage and antiseptic",
                "Pain medication administered", "Allergy medication given",
                "Breathing treatment", "Blood sugar monitoring", "First aid applied"
            };

            var treatmentDescriptions = new[]
            {
                "Student responded well to treatment",
                "Symptoms improved after medication",
                "Wound cleaned and dressed properly",
                "Monitored for 30 minutes post-treatment",
                "Parent contacted and notified",
                "Follow-up recommended",
                "Full recovery expected",
                "Student returned to class after treatment"
            };

            var treatmentRecords = new List<Treatmentrecord>();

            for (int i = 0; i < 40; i++)
            {
                var selectedHealthRecord = healthRecords[_random.Next(healthRecords.Count)];

                treatmentRecords.Add(new Treatmentrecord
                {
                    Id = $"treatment-{(i + 1):D3}",
                    StudentId = selectedHealthRecord.StudentId,
                    StudentHealthRecordId = selectedHealthRecord.Id,
                    RecordDate = DateTime.Now.AddDays(-_random.Next(0, 90)).AddHours(-_random.Next(0, 24)),
                    Treatment = treatments[_random.Next(treatments.Length)],
                    Description = treatmentDescriptions[_random.Next(treatmentDescriptions.Length)],
                    Status = RecordStatus.Active.ToString()
                });
            }

            context.Treatmentrecords.AddRange(treatmentRecords);
            await context.SaveChangesAsync();
        }

        private static async Task SeedVaccineRecordsAsync(SchoolhealthdbContext context)
        {
            var healthRecords = context.Studenthealthrecords.ToList();

            var vaccines = new[]
            {
                "MMR (Measles, Mumps, Rubella)", "DTaP (Diphtheria, Tetanus, Pertussis)",
                "Polio (IPV)", "Hepatitis B", "Varicella (Chickenpox)",
                "HPV (Human Papillomavirus)", "Meningococcal", "Tdap Booster", "Influenza"
            };

            var vaccineDescriptions = new[]
            {
                "Routine immunization completed",
                "Booster dose administered",
                "Catch-up vaccination",
                "Annual vaccination",
                "Required for school enrollment",
                "Travel vaccination",
                "Recommended by healthcare provider"
            };

            var vaccineRecords = new List<Vaccinerecord>();

            for (int i = 0; i < 60; i++)
            {
                var selectedHealthRecord = healthRecords[_random.Next(healthRecords.Count)];

                vaccineRecords.Add(new Vaccinerecord
                {
                    Id = $"vaccine-{(i + 1):D3}",
                    StudentId = selectedHealthRecord.StudentId,
                    StudentHealthRecordId = selectedHealthRecord.Id,
                    RecordDate = DateTime.Now.AddDays(-_random.Next(30, 365)).AddHours(-_random.Next(0, 24)),
                    Vaccine = vaccines[_random.Next(vaccines.Length)],
                    Description = vaccineDescriptions[_random.Next(vaccineDescriptions.Length)],
                    Status = RecordStatus.Active.ToString()
                });
            }

            context.Vaccinerecords.AddRange(vaccineRecords);
            await context.SaveChangesAsync();
        }

        private static async Task SeedHealthCheckupEventsAsync(SchoolhealthdbContext context)
        {
            var adminIds = context.Accounts.Where(a => a.Role == "Admin").Select(a => a.Id).ToList();
            var nurseIds = context.Accounts.Where(a => a.Role == "SchoolNurse").Select(a => a.Id).ToList();
            var creatorIds = adminIds.Concat(nurseIds).ToList();
            var studentIds = context.Accounts.Where(a => a.Role == "Student").Select(a => a.Id).ToList();

            var events = new[]
            {
                new { Title = "Annual Health Screening", ShortDesc = "Comprehensive health check for all students", Content = "Annual health screening includes vision, hearing, height, weight, and general health assessment." },
                new { Title = "Vision and Hearing Test", ShortDesc = "Eye and ear examination", Content = "Detailed vision and hearing assessment conducted by certified professionals." },
                new { Title = "Dental Health Checkup", ShortDesc = "Oral health examination", Content = "Dental screening and oral health education program." },
                new { Title = "BMI Assessment", ShortDesc = "Body Mass Index evaluation", Content = "Height and weight measurements to assess healthy growth patterns." },
                new { Title = "Immunization Review", ShortDesc = "Vaccination record verification", Content = "Review of vaccination records and catch-up immunizations if needed." }
            };

            var checkupEvents = new List<Healthcheckupevent>();

            for (int i = 0; i < 15; i++)
            {
                var eventTemplate = events[_random.Next(events.Length)];
                var eventDate = DateTime.Now.AddDays(_random.Next(-30, 60));

                checkupEvents.Add(new Healthcheckupevent
                {
                    Id = $"checkup-{(i + 1):D3}",
                    StudentId = _random.Next(0, 3) == 0 ? studentIds[_random.Next(studentIds.Count)] : null, // 33% chance of specific student
                    CreatedBy = creatorIds[_random.Next(creatorIds.Count)],
                    Title = eventTemplate.Title,
                    ShortDescription = eventTemplate.ShortDesc,
                    Content = eventTemplate.Content,
                    DateOccurred = eventDate,
                    DateSignupStart = eventDate.AddDays(-14),
                    DateSignupEnd = eventDate.AddDays(-1),
                    Status = GetEventStatus(eventDate)
                });
            }

            context.Healthcheckupevents.AddRange(checkupEvents);
            await context.SaveChangesAsync();
        }

        private static async Task SeedVaccineEventsAsync(SchoolhealthdbContext context)
        {
            var adminIds = context.Accounts.Where(a => a.Role == "Admin").Select(a => a.Id).ToList();
            var nurseIds = context.Accounts.Where(a => a.Role == "SchoolNurse").Select(a => a.Id).ToList();
            var creatorIds = adminIds.Concat(nurseIds).ToList();
            var studentIds = context.Accounts.Where(a => a.Role == "Student").Select(a => a.Id).ToList();

            var events = new[]
            {
                new { Title = "Flu Vaccination Drive", ShortDesc = "Annual influenza vaccination", Content = "Free flu shots available for all students and staff. Parental consent required." },
                new { Title = "HPV Vaccination Program", ShortDesc = "HPV vaccine for eligible students", Content = "HPV vaccination program for students aged 11-18. Educational session included." },
                new { Title = "Meningitis Vaccination", ShortDesc = "Meningococcal vaccine administration", Content = "Meningitis vaccination for high school students and college-bound seniors." },
                new { Title = "Catch-up Immunization Clinic", ShortDesc = "Missed vaccination makeup", Content = "Opportunity for students to receive any missed or delayed vaccinations." }
            };

            var vaccineEvents = new List<Vaccineevent>();

            for (int i = 0; i < 12; i++)
            {
                var eventTemplate = events[_random.Next(events.Length)];
                var eventDate = DateTime.Now.AddDays(_random.Next(-60, 90));

                vaccineEvents.Add(new Vaccineevent
                {
                    Id = $"vaccinevent-{(i + 1):D3}",
                    StudentId = _random.Next(0, 4) == 0 ? studentIds[_random.Next(studentIds.Count)] : null, // 25% chance of specific student
                    CreatedBy = creatorIds[_random.Next(creatorIds.Count)],
                    Title = eventTemplate.Title,
                    ShortDescription = eventTemplate.ShortDesc,
                    Content = eventTemplate.Content,
                    DateOccurred = eventDate,
                    DateSignupStart = eventDate.AddDays(-21),
                    DateSignupEnd = eventDate.AddDays(-3),
                    Status = GetEventStatus(eventDate)
                });
            }

            context.Vaccineevents.AddRange(vaccineEvents);
            await context.SaveChangesAsync();
        }

        private static string GetEventStatus(DateTime eventDate)
        {
            var now = DateTime.Now;
            if (eventDate < now)
            {
                return EventStatus.Completed.ToString();
            }
            else if (eventDate.AddDays(-7) <= now && now <= eventDate)
            {
                return EventStatus.Ongoing.ToString();
            }
            else if (eventDate > now)
            {
                return EventStatus.Upcoming.ToString();
            }
            else
            {
                return EventStatus.Cancelled.ToString();
            }
        }
        */
    }
}