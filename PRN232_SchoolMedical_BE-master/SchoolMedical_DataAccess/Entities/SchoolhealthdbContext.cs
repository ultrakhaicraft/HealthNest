using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SchoolMedical_DataAccess.Entities;

public partial class SchoolhealthdbContext : DbContext
{
    public SchoolhealthdbContext()
    {
    }

    public SchoolhealthdbContext(DbContextOptions<SchoolhealthdbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }
	public virtual DbSet<Nurse> Nurses { get; set; }
	public virtual DbSet<Student> Students { get; set; }
	public virtual DbSet<Parent> Parents { get; set; }
	public virtual DbSet<Admin> Admins { get; set; }
	public virtual DbSet<Healthcheckupevent> Healthcheckupevents { get; set; }
    public virtual DbSet<HealthcheckupeventStudent> HealthcheckupeventStudents { get; set; } //Add them as a join table because it has additional info
    public virtual DbSet<Incidentrecord> Incidentrecords { get; set; }
    public virtual DbSet<Medicalsupply> Medicalsupplies { get; set; }
    public virtual DbSet<Medicine> Medicines { get; set; }
    public virtual DbSet<Medicinerequest> Medicinerequests { get; set; }
    public virtual DbSet<Studenthealthrecord> Studenthealthrecords { get; set; }
    public virtual DbSet<Treatmentrecord> Treatmentrecords { get; set; }
    public virtual DbSet<Vaccineevent> Vaccineevents { get; set; }
    public virtual DbSet<VaccineeventStudent> VaccineeventStudents { get; set; } //Add them as a join table because it has additional info
	public virtual DbSet<Vaccinerecord> Vaccinerecords { get; set; }
    public virtual DbSet<Meeting> Meetings { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            //Basic infos
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("accounts");

            //Properties
            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.PhoneNumber).HasMaxLength(50);
            entity.Property(e => e.Role).HasMaxLength(20);
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(15);
            entity.Property(e => e.Gender).HasMaxLength(10);
            entity.Property(e => e.AvatarUrl).HasMaxLength(255);


            entity.Property(e => e.DateOfBirth)
                .HasColumnType("datetime");

            entity.Property(e => e.AccountCreationDateTime)
                .HasColumnType("datetime")
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            //Relationships
            //Since these table is relies on Account, they will be useless if Account is deleted
            //So it's best to delete altogether
            //One to one
            entity.HasOne(a => a.Student)
              .WithOne(s => s.Account)
              .HasForeignKey<Student>(s => s.Id)
              .OnDelete(DeleteBehavior.Cascade)
              .HasConstraintName("FK_Account_Student");

            entity.HasOne(a => a.Nurse)
              .WithOne(s => s.Account)
              .HasForeignKey<Nurse>(s => s.Id)
              .OnDelete(DeleteBehavior.Cascade)
			  .HasConstraintName("FK_Account_Nurse");

			entity.HasOne(a => a.Admin)
              .WithOne(s => s.Account)
              .HasForeignKey<Admin>(s => s.Id)
              .OnDelete(DeleteBehavior.Cascade)
			  .HasConstraintName("FK_Account_Admin");

			entity.HasOne(a => a.Parent)
              .WithOne(s => s.Account)
              .HasForeignKey<Parent>(s => s.Id)
              .OnDelete(DeleteBehavior.Cascade)
			  .HasConstraintName("FK_Account_Parent");

			//Indexes
			entity.HasIndex(e => e.Email, "Email").IsUnique().HasDatabaseName("IX_Accounts_Email");
            entity.HasIndex(e => e.Role).HasDatabaseName("IX_Accounts_Role"); // Index for role-based queries
        });


        modelBuilder.Entity<Student>(entity =>
        {
			entity.HasKey(e => e.Id).HasName("PRIMARY"); //Share the same value as Account.Id, basically shared primary key

			entity.ToTable("students");

			entity.Property(e => e.Id).HasMaxLength(50);
			entity.Property(e => e.ParentId).HasMaxLength(50);
			entity.Property(e => e.Class).HasMaxLength(25);
			entity.Property(e => e.CurrentHealthStatus).HasMaxLength(15);

			entity.HasOne(a => a.Account)
			  .WithOne(s => s.Student)
			  .HasForeignKey<Student>(s => s.Id)
			  .OnDelete(DeleteBehavior.Restrict) //Delete the Student info does not delete the Account
			  .HasConstraintName("FK_Student_Account");

			//Student -> Parent: Many to One
			entity.HasOne(a => a.Parent)
			  .WithMany(s => s.Children)
			  .HasForeignKey(s => s.ParentId)
			  .OnDelete(DeleteBehavior.Restrict) //Delete the Student info does not delete the Parent
              .HasConstraintName("FK_Student_Parent");

			entity.HasIndex(e => e.ParentId).HasDatabaseName("IX_Students_ParentId");
		});

		modelBuilder.Entity<Parent>(entity =>
		{
			entity.HasKey(e => e.Id).HasName("PRIMARY"); //Share the same value as Account.Id, basically shared primary key

			entity.ToTable("parents");

			entity.Property(e => e.Id).HasMaxLength(50);
			entity.Property(e => e.RelationshipStatus).HasMaxLength(25);
			entity.Property(e => e.IncomeLevel).HasMaxLength(25);

            //One to one
			entity.HasOne(a => a.Account)
			  .WithOne(s => s.Parent)
			  .HasForeignKey<Parent>(s => s.Id)
			  .OnDelete(DeleteBehavior.Restrict) //Delete the Parent info does not delete the Account
			  .HasConstraintName("FK_Parent_Account");



		});

		modelBuilder.Entity<Nurse>(entity =>
		{
			entity.HasKey(e => e.Id).HasName("PRIMARY"); //Share the same value as Account.Id, basically shared primary key

			entity.ToTable("nurses");

			entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");


			//One to one
			entity.HasOne(a => a.Account)
			  .WithOne(s => s.Nurse)
			  .HasForeignKey<Nurse>(s => s.Id)
			  .OnDelete(DeleteBehavior.Restrict) //Delete the Nurse info does not delete the Account
		      .HasConstraintName("FK_Nurse_Account");


		});

		modelBuilder.Entity<Admin>(entity =>
		{
			entity.HasKey(e => e.Id).HasName("PRIMARY"); //Share the same value as Account.Id, basically shared primary key

			entity.ToTable("admins");

			entity.Property(e => e.Id).HasMaxLength(50);
			entity.Property(e => e.Description).HasColumnType("text");

			//One to one
			entity.HasOne(a => a.Account)
			  .WithOne(s => s.Admin)
			  .HasForeignKey<Admin>(s => s.Id)
			  .OnDelete(DeleteBehavior.Restrict) //Delete the Admin info does not delete the Account
			  .HasConstraintName("FK_Admin_Account");
		});

		modelBuilder.Entity<Healthcheckupevent>(entity =>
        {
            //Basic Info
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("healthcheckupevents");

            //Properties
            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CreatedBy).HasMaxLength(50); //Admin Id
            entity.Property(e => e.DateOccurred).HasColumnType("datetime");
            entity.Property(e => e.DateSignupEnd).HasColumnType("datetime");
            entity.Property(e => e.DateSignupStart).HasColumnType("datetime");
            entity.Property(e => e.ShortDescription).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(15);
            entity.Property(e => e.Title).HasMaxLength(100);

            //Relationship
            entity
                .HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.HealthcheckupeventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_HealthCheckupEvent_CreatedBy");

            //Indexes
			entity.HasIndex(e => e.CreatedBy, "IDX_HealthCheckupEvent_CreatedBy");
            entity.HasIndex(e => e.DateOccurred, "IDX_HealthCheckupEvent_DateOccurred");

		});

        modelBuilder.Entity<Incidentrecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("incidentrecords");

         
            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.DateOccurred).HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.HandleBy).HasMaxLength(50); //Nurse Id
            entity.Property(e => e.IncidentType).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(15);
            entity.Property(e => e.StudentId).HasMaxLength(50);

            entity.HasOne(d => d.HandleByNavigation)
                .WithMany(p => p.IncidentrecordHandleByNavigations)
                .HasForeignKey(d => d.HandleBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_IncidentRecord_HandleBy");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.IncidentrecordStudents)
                .HasForeignKey(d => d.StudentId)
				.OnDelete(DeleteBehavior.Restrict) //Leave the data alone
				.HasConstraintName("FK_IncidentRecord_Student");

			entity.HasIndex(e => e.HandleBy, "IDX_IncidentRecord_HandleBy");
			entity.HasIndex(e => e.StudentId, "IDX_IncidentRecord_StudentId");
            entity.HasIndex(e => e.DateOccurred, "IDX_IncidentRecord_DateOccurred");
		});

        modelBuilder.Entity<Medicalsupply>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("medicalsupplies");


            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");
			entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Amount);
			entity.Property(e => e.IsAvailable)
                .IsRequired()
                .HasDefaultValueSql("'1'");
			entity.Property(e => e.IsDeleted)
				.IsRequired()
				.HasDefaultValueSql("'0'");


			entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.Medicalsupplies)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_MedicalSupply_CreatedBy");


			entity.HasIndex(e => e.CreatedBy, "IDX_MedicalSupply_CreatedBy");
		});

        modelBuilder.Entity<Medicine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("medicines");


            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasMaxLength(50); //Nurse Id
            entity.Property(e => e.Description).HasColumnType("text");
			entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Amount);
			entity.Property(e => e.IsAvailable)
				.IsRequired()
				.HasDefaultValueSql("'1'");
			entity.Property(e => e.IsDeleted)
				.IsRequired()
				.HasDefaultValueSql("'0'");


			entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.Medicines)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Medicine_CreatedBy");

			entity.HasIndex(e => e.CreatedBy, "IDX_Medicine_CreatedBy");
            entity.HasIndex(e => e.Name, "IDX_Medicine_Name");
		});

        modelBuilder.Entity<Medicinerequest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("medicinerequests");


            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.DateSent).HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.ForStudent).HasMaxLength(50); //Student Id
            entity.Property(e => e.RequestBy).HasMaxLength(50); //Parent Id
            entity.Property(e => e.Status).HasMaxLength(15);
            
            //Relationship
            //Student -> MedicineRequest: One to Many
            entity.HasOne(d => d.ForStudentNavigation)
                .WithMany(p => p.MedicinerequestForStudentNavigations)
                .HasForeignKey(d => d.ForStudent)
				.OnDelete(DeleteBehavior.Cascade) //Non-essential data to track so we can cascade delete it
				.HasConstraintName("FK_MedicineRequest_ForStudent");

			//Parent -> MedicineRequest: One to Many
			entity.HasOne(d => d.RequestByNavigation)
                .WithMany(p => p.MedicinerequestRequestByNavigations)
                .HasForeignKey(d => d.RequestBy)
                .OnDelete(DeleteBehavior.Cascade) //Non-essential data to track so we can cascade delete it
				.HasConstraintName("FK_MedicineRequest_RequestBy");


            //Indexes
			entity.HasIndex(e => e.ForStudent, "IDX_MedicineRequest_ForStudent");
			entity.HasIndex(e => e.RequestBy, "IDX_MedicineRequest_RequestBy");
		});

		// Many-to-many join: Healthcheckupevent <-> Account

		modelBuilder.Entity<HealthcheckupeventStudent>(entity =>
		{
			entity.ToTable("healthcheckupevent_student");

			entity.HasKey(e => new { e.HealthcheckupeventId, e.StudentId });

			entity.Property(e => e.HealthcheckupeventId).HasMaxLength(50);
			entity.Property(e => e.StudentId).HasMaxLength(50);
			entity.Property(e => e.SignupDate).HasColumnType("datetime");
			entity.Property(e => e.ResultSummary).HasColumnType("text");
			entity.Property(e => e.Status).HasMaxLength(15);

			entity.HasOne(e => e.Healthcheckupevent)
				  .WithMany(h => h.HealthcheckupeventStudents)
				  .HasForeignKey(e => e.HealthcheckupeventId)
				  .OnDelete(DeleteBehavior.Cascade)
				  .HasConstraintName("FK_HealthcheckupeventStudent_Event");

			entity.HasOne(e => e.Student)
				  .WithMany(a => a.HealthcheckupeventStudents)
				  .HasForeignKey(e => e.StudentId)
				  .OnDelete(DeleteBehavior.Cascade)
				  .HasConstraintName("FK_HealthcheckupeventStudent_Student");
		});

		// Many-to-many join: Vaccineevent <-> Account
		modelBuilder.Entity<VaccineeventStudent>(entity =>
		{
			entity.ToTable("vaccineevent_student");

			entity.HasKey(e => new { e.VaccineeventId, e.StudentId });

			entity.Property(e => e.VaccineeventId).HasMaxLength(50);
			entity.Property(e => e.StudentId).HasMaxLength(50);
			entity.Property(e => e.SignupDate).HasColumnType("datetime");
			entity.Property(e => e.ResultSummary).HasColumnType("text");
			entity.Property(e => e.Status).HasMaxLength(15);

			entity.HasOne(e => e.Vaccineevent)
				  .WithMany(v => v.VaccineeventStudents)
				  .HasForeignKey(e => e.VaccineeventId)
				  .OnDelete(DeleteBehavior.Cascade)
				  .HasConstraintName("FK_VaccineeventStudent_Event");

			entity.HasOne(e => e.Student)
				  .WithMany(a => a.VaccineeventStudents)
				  .HasForeignKey(e => e.StudentId)
				  .OnDelete(DeleteBehavior.Cascade)
				  .HasConstraintName("FK_VaccineeventStudent_Student");
		});


		modelBuilder.Entity<Studenthealthrecord>(entity =>
        {

            //Basic Info
            entity.HasKey(e => e.Id).HasName("PRIMARY");
            entity.ToTable("studenthealthrecords");

            //Property
            entity.Property(e => e.Id).HasMaxLength(50);
			entity.Property(e => e.StudentId).HasMaxLength(50);
			entity.Property(e => e.CreatedBy).HasMaxLength(50); //Nurse Id
			entity.Property(e => e.Height);
			entity.Property(e => e.Weight);
			entity.Property(e => e.Allergies).HasColumnType("text");
            entity.Property(e => e.HealthHistory).HasColumnType("text");
			entity.Property(e => e.Vision).HasColumnType("text");
			entity.Property(e => e.EarNoseAndMouth).HasColumnType("text");
			entity.Property(e => e.Teeth).HasColumnType("text");
			entity.Property(e => e.BloodProfile).HasColumnType("text");
			entity.Property(e => e.BloodPressure).HasColumnType("text");
			entity.Property(e => e.Heart).HasColumnType("text");
			entity.Property(e => e.Status).HasMaxLength(15);
			entity.Property(e => e.CreatedDateTime).HasColumnType("datetime");
			entity.Property(e => e.UpdatedDateTime).HasColumnType("datetime");


			entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.StudenthealthrecordCreatedByNavigations) //Nurse handle the creation
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_StudentHealthRecord_CreatedBy");

            entity.HasOne(s => s.Student)
                .WithOne(a => a.StudentHealthRecord)
                .HasForeignKey<Studenthealthrecord>(s => s.StudentId)
                .OnDelete(DeleteBehavior.Restrict) //Leave the data alone even after the student is deleted
                .HasConstraintName("FK_FK_StudentHealthRecord_Student");


			entity.HasIndex(e => e.CreatedBy, "IDX_StudentHealthRecord_CreatedBy");
			entity.HasIndex(e => e.StudentId, "IDX_StudentHealthRecord_StudentId")
				  .IsUnique();
		});

        modelBuilder.Entity<Treatmentrecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("treatmentrecords");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.RecordDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(15);
            entity.Property(e => e.StudentHealthRecordId).HasMaxLength(50);
            entity.Property(e => e.TreatmentTitle).HasMaxLength(50);

            entity.HasOne(d => d.StudentHealthRecord)
                .WithMany(p => p.Treatmentrecords)
                .HasForeignKey(d => d.StudentHealthRecordId)
                .OnDelete(DeleteBehavior.Cascade) //If StudentHealthRecord is deleted, delete this also
                .HasConstraintName("FK_TreatmentRecord_StudentHealthRecord");

			entity.HasIndex(e => e.StudentHealthRecordId, "IDX_TreatmentRecord_StudentHealthRecordId");

		});

		modelBuilder.Entity<Vaccinerecord>(entity =>
		{
			entity.HasKey(e => e.Id).HasName("PRIMARY");
			entity.ToTable("vaccinerecords");


			//Property
			entity.Property(e => e.Id).HasMaxLength(50);
			entity.Property(e => e.Description).HasColumnType("text");
			entity.Property(e => e.RecordDate).HasColumnType("datetime");
			entity.Property(e => e.Status).HasMaxLength(15);
			entity.Property(e => e.StudentHealthRecordId).HasMaxLength(50);
			entity.Property(e => e.VaccineTitle).HasMaxLength(50);

			entity.HasOne(d => d.StudentHealthRecord)
				.WithMany(p => p.Vaccinerecords)
				.HasForeignKey(d => d.StudentHealthRecordId)
                .OnDelete(DeleteBehavior.Cascade) //If StudentHealthRecord is deleted, delete this also
				.HasConstraintName("FK_VaccineRecord_StudentHealthRecord");

			entity.HasIndex(e => e.StudentHealthRecordId, "IDX_VaccineRecord_StudentHealthRecordId");

		});

		modelBuilder.Entity<Vaccineevent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vaccineevents");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CreatedBy).HasMaxLength(50); //Admin Id
            entity.Property(e => e.DateOccurred).HasColumnType("datetime");
            entity.Property(e => e.DateSignupEnd).HasColumnType("datetime");
            entity.Property(e => e.DateSignupStart).HasColumnType("datetime");
            entity.Property(e => e.ShortDescription).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(15);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VaccineeventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_VaccineEvent_CreatedBy");

			entity.HasIndex(e => e.CreatedBy, "IDX_VaccineEvent_CreatedBy");
			entity.HasIndex(e => e.DateOccurred, "IDX_VaccineEvent_DateOccurred");

		});

        

		modelBuilder.Entity<Meeting>(entity =>
		{
			entity.HasKey(e => e.Id).HasName("PRIMARY");

			entity.ToTable("meeting");

		
			entity.Property(e => e.Id).HasMaxLength(50);
			entity.Property(e => e.StudentId).HasMaxLength(50);
			entity.Property(e => e.HandleBy).HasMaxLength(50); //Nurse Id
			entity.Property(e => e.Title).HasMaxLength(100);
			entity.Property(e => e.Content).HasColumnType("text");
			entity.Property(e => e.ScheduledDate).HasColumnType("datetime");
			entity.Property(e => e.Status).HasMaxLength(15);
			entity.Property(e => e.ParentAttended).IsRequired().HasDefaultValue(false);

			entity.HasOne(m => m.Student)
				  .WithMany(a => a.MeetingStudents)
				  .HasForeignKey(m => m.StudentId)
				  .OnDelete(DeleteBehavior.Restrict) //Leave the data alone
				  .HasConstraintName("FK_Meeting_Student");

			entity.HasOne(m => m.HandleByNavigation)
				  .WithMany(a => a.MeetingHandleByNavigations)
				  .HasForeignKey(m => m.HandleBy)
				  .OnDelete(DeleteBehavior.Restrict) //Leave the data alone
				  .HasConstraintName("FK_Meeting_HandleBy");

			entity.HasIndex(e => e.StudentId, "IDX_Meeting_StudentId");
			entity.HasIndex(e => e.HandleBy, "IDX_Meeting_HandleBy");
		});




		OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
