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

    public virtual DbSet<Healthcheckupevent> Healthcheckupevents { get; set; }

    public virtual DbSet<Incidentrecord> Incidentrecords { get; set; }

    public virtual DbSet<Medicalsupply> Medicalsupplies { get; set; }

    public virtual DbSet<Medicine> Medicines { get; set; }

    public virtual DbSet<Medicinerequest> Medicinerequests { get; set; }

    public virtual DbSet<Studenthealthrecord> Studenthealthrecords { get; set; }

    public virtual DbSet<Treatmentrecord> Treatmentrecords { get; set; }

    public virtual DbSet<Vaccineevent> Vaccineevents { get; set; }

    public virtual DbSet<Vaccinerecord> Vaccinerecords { get; set; }

   

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("accounts");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.HasIndex(e => e.ParentId, "FK_Account_Parent");

            entity.HasIndex(e => e.Role, "IDX_Account_Role");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Address).HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.FullName).HasMaxLength(25);
            entity.Property(e => e.ParentId).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.PhoneNumber).HasMaxLength(50);
            entity.Property(e => e.Role).HasMaxLength(15);
            entity.Property(e => e.Status).HasMaxLength(20);

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_Account_Parent");
        });

        modelBuilder.Entity<Healthcheckupevent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("healthcheckupevents");

            entity.HasIndex(e => e.CreatedBy, "IDX_HealthCheckupEvent_CreatedBy");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.DateOccurred).HasColumnType("datetime");
            entity.Property(e => e.DateSignupEnd).HasColumnType("datetime");
            entity.Property(e => e.DateSignupStart).HasColumnType("datetime");
            entity.Property(e => e.ShortDescription).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.HealthcheckupeventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_HealthCheckupEvent_CreatedBy");		
           
		});

        modelBuilder.Entity<Incidentrecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("incidentrecords");

            entity.HasIndex(e => e.HandleBy, "IDX_IncidentRecord_HandleBy");

            entity.HasIndex(e => e.StudentId, "IDX_IncidentRecord_StudentId");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.DateOccurred).HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.HandleBy).HasMaxLength(50);
            entity.Property(e => e.IncidentType).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentId).HasMaxLength(50);

            entity.HasOne(d => d.HandleByNavigation).WithMany(p => p.IncidentrecordHandleByNavigations)
                .HasForeignKey(d => d.HandleBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_IncidentRecord_HandleBy");

            entity.HasOne(d => d.Student).WithMany(p => p.IncidentrecordStudents)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK_IncidentRecord_Student");
        });

        modelBuilder.Entity<Medicalsupply>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("medicalsupplies");

            entity.HasIndex(e => e.CreatedBy, "IDX_MedicalSupply_CreatedBy");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.IsAvailable)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Medicalsupplies)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_MedicalSupply_CreatedBy");
        });

        modelBuilder.Entity<Medicine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("medicines");

            entity.HasIndex(e => e.CreatedBy, "IDX_Medicine_CreatedBy");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.IsAvailable)
                .IsRequired()
                .HasDefaultValueSql("'1'");
            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Medicines)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Medicine_CreatedBy");
        });

        modelBuilder.Entity<Medicinerequest>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("medicinerequests");

            entity.HasIndex(e => e.ForStudent, "IDX_MedicineRequest_ForStudent");

            entity.HasIndex(e => e.RequestBy, "IDX_MedicineRequest_RequestBy");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.DateSent).HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.ForStudent).HasMaxLength(50);
            entity.Property(e => e.RequestBy).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(20);

            entity.HasOne(d => d.ForStudentNavigation).WithMany(p => p.MedicinerequestForStudentNavigations)
                .HasForeignKey(d => d.ForStudent)
                .HasConstraintName("FK_MedicineRequest_ForStudent");

            entity.HasOne(d => d.RequestByNavigation).WithMany(p => p.MedicinerequestRequestByNavigations)
                .HasForeignKey(d => d.RequestBy)
                .HasConstraintName("FK_MedicineRequest_RequestBy");
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
			entity.Property(e => e.Status).HasMaxLength(50);

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
			entity.Property(e => e.Status).HasMaxLength(50);

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
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("studenthealthrecords");

            entity.HasIndex(e => e.CreatedBy, "IDX_StudentHealthRecord_CreatedBy");

            entity.HasIndex(e => e.StudentId, "IDX_StudentHealthRecord_StudentId")
                  .IsUnique();

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Allergies).HasColumnType("text");
            entity.Property(e => e.ChronicDiseases).HasColumnType("text");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.Hearing).HasColumnType("text");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentId).HasMaxLength(50);
            entity.Property(e => e.Vision).HasColumnType("text");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.StudenthealthrecordCreatedByNavigations) //Nurse handle the creation
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_StudentHealthRecord_CreatedBy");

            entity.HasOne(s => s.Student)
		        .WithOne(a => a.StudentHealthRecord)
		        .HasForeignKey<Studenthealthrecord>(s => s.StudentId);


		});

        modelBuilder.Entity<Treatmentrecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("treatmentrecords");

            entity.HasIndex(e => e.StudentHealthRecordId, "IDX_TreatmentRecord_StudentHealthRecordId");


            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.RecordDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentHealthRecordId).HasMaxLength(50);
            entity.Property(e => e.Treatment).HasMaxLength(50);

            entity.HasOne(d => d.StudentHealthRecord).WithMany(p => p.Treatmentrecords)
                .HasForeignKey(d => d.StudentHealthRecordId)
                .HasConstraintName("FK_TreatmentRecord_StudentHealthRecord");

          
        });

        modelBuilder.Entity<Vaccineevent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vaccineevents");

            entity.HasIndex(e => e.CreatedBy, "IDX_VaccineEvent_CreatedBy");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.DateOccurred).HasColumnType("datetime");
            entity.Property(e => e.DateSignupEnd).HasColumnType("datetime");
            entity.Property(e => e.DateSignupStart).HasColumnType("datetime");
            entity.Property(e => e.ShortDescription).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VaccineeventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_VaccineEvent_CreatedBy");


		


		});

        modelBuilder.Entity<Vaccinerecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vaccinerecords");

            entity.HasIndex(e => e.StudentHealthRecordId, "IDX_VaccineRecord_StudentHealthRecordId");


            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.RecordDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentHealthRecordId).HasMaxLength(50);
            entity.Property(e => e.Vaccine).HasMaxLength(50);

            entity.HasOne(d => d.StudentHealthRecord).WithMany(p => p.Vaccinerecords)
                .HasForeignKey(d => d.StudentHealthRecordId)
                .HasConstraintName("FK_VaccineRecord_StudentHealthRecord");

           
        });

		modelBuilder.Entity<Meeting>(entity =>
		{
			entity.HasKey(e => e.Id).HasName("PRIMARY");

			entity.ToTable("meeting");

			entity.HasIndex(e => e.StudentId, "IDX_Meeting_StudentId");
			entity.HasIndex(e => e.HandleBy, "IDX_Meeting_HandleBy");

			entity.Property(e => e.Id).HasMaxLength(50);
			entity.Property(e => e.StudentId).HasMaxLength(50);
			entity.Property(e => e.HandleBy).HasMaxLength(50);
			entity.Property(e => e.Title).HasMaxLength(100);
			entity.Property(e => e.Content).HasColumnType("text");
			entity.Property(e => e.ScheduledDate).HasColumnType("datetime");
			entity.Property(e => e.Status).HasMaxLength(20);
			entity.Property(e => e.ParentAttended).IsRequired().HasDefaultValue(false);

			entity.HasOne(m => m.Student)
				  .WithMany(a => a.MeetingStudents)
				  .HasForeignKey(m => m.StudentId)
				  .OnDelete(DeleteBehavior.Restrict)
				  .HasConstraintName("FK_Meeting_Student");

			entity.HasOne(m => m.HandleByNavigation)
				  .WithMany(a => a.MeetingHandleByNavigations)
				  .HasForeignKey(m => m.HandleBy)
				  .OnDelete(DeleteBehavior.Restrict)
				  .HasConstraintName("FK_Meeting_HandleBy");
		});




		OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
