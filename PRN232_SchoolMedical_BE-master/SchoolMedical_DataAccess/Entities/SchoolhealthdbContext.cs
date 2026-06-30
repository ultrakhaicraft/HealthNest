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

    public virtual DbSet<StudentHealthcheckup> StudentHealthcheckups { get; set; }

    public virtual DbSet<StudentVaccinecheckup> StudentVaccinecheckups { get; set; }

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

            entity.HasIndex(e => e.StudentId, "IDX_HealthCheckupEvent_StudentId");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.DateOccurred).HasColumnType("datetime");
            entity.Property(e => e.DateSignupEnd).HasColumnType("datetime");
            entity.Property(e => e.DateSignupStart).HasColumnType("datetime");
            entity.Property(e => e.ShortDescription).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentId).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.HealthcheckupeventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_HealthCheckupEvent_CreatedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.HealthcheckupeventStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_HealthCheckupEvent_Student");
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

        modelBuilder.Entity<StudentHealthcheckup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("student_healthcheckup");

            entity.HasIndex(e => e.EventId, "EventId");

            entity.HasIndex(e => e.StudentId, "StudentId");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.EventId).HasMaxLength(50);
            entity.Property(e => e.ResultSummary).HasColumnType("text");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.StudentId).HasMaxLength(50);

            entity.HasOne(d => d.Event).WithMany(p => p.StudentHealthcheckups)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("student_healthcheckup_ibfk_1");

            entity.HasOne(d => d.Student).WithMany(p => p.StudentHealthcheckups)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("student_healthcheckup_ibfk_2");
        });

        modelBuilder.Entity<StudentVaccinecheckup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("student_vaccinecheckup");

            entity.HasIndex(e => e.EventId, "EventId");

            entity.HasIndex(e => e.StudentId, "StudentId");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.EventId).HasMaxLength(50);
            entity.Property(e => e.ResultSummary).HasColumnType("text");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.StudentId).HasMaxLength(50);

            entity.HasOne(d => d.Event).WithMany(p => p.StudentVaccinecheckups)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("student_vaccinecheckup_ibfk_1");

            entity.HasOne(d => d.Student).WithMany(p => p.StudentVaccinecheckups)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("student_vaccinecheckup_ibfk_2");
        });

        modelBuilder.Entity<Studenthealthrecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("studenthealthrecords");

            entity.HasIndex(e => e.CreatedBy, "IDX_StudentHealthRecord_CreatedBy");

            entity.HasIndex(e => e.StudentId, "IDX_StudentHealthRecord_StudentId");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Allergies).HasColumnType("text");
            entity.Property(e => e.ChronicDiseases).HasColumnType("text");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.Hearing).HasColumnType("text");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentId).HasMaxLength(50);
            entity.Property(e => e.Vision).HasColumnType("text");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.StudenthealthrecordCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_StudentHealthRecord_CreatedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.StudenthealthrecordStudents)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK_StudentHealthRecord_Student");
        });

        modelBuilder.Entity<Treatmentrecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("treatmentrecords");

            entity.HasIndex(e => e.StudentHealthRecordId, "IDX_TreatmentRecord_StudentHealthRecordId");

            entity.HasIndex(e => e.StudentId, "IDX_TreatmentRecord_StudentId");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.RecordDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentHealthRecordId).HasMaxLength(50);
            entity.Property(e => e.StudentId).HasMaxLength(50);
            entity.Property(e => e.Treatment).HasMaxLength(50);

            entity.HasOne(d => d.StudentHealthRecord).WithMany(p => p.Treatmentrecords)
                .HasForeignKey(d => d.StudentHealthRecordId)
                .HasConstraintName("FK_TreatmentRecord_StudentHealthRecord");

            entity.HasOne(d => d.Student).WithMany(p => p.Treatmentrecords)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK_TreatmentRecord_Student");
        });

        modelBuilder.Entity<Vaccineevent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vaccineevents");

            entity.HasIndex(e => e.CreatedBy, "IDX_VaccineEvent_CreatedBy");

            entity.HasIndex(e => e.StudentId, "IDX_VaccineEvent_StudentId");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CreatedBy).HasMaxLength(50);
            entity.Property(e => e.DateOccurred).HasColumnType("datetime");
            entity.Property(e => e.DateSignupEnd).HasColumnType("datetime");
            entity.Property(e => e.DateSignupStart).HasColumnType("datetime");
            entity.Property(e => e.ShortDescription).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentId).HasMaxLength(50);
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.VaccineeventCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_VaccineEvent_CreatedBy");

            entity.HasOne(d => d.Student).WithMany(p => p.VaccineeventStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_VaccineEvent_Student");
        });

        modelBuilder.Entity<Vaccinerecord>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("vaccinerecords");

            entity.HasIndex(e => e.StudentHealthRecordId, "IDX_VaccineRecord_StudentHealthRecordId");

            entity.HasIndex(e => e.StudentId, "IDX_VaccineRecord_StudentId");

            entity.Property(e => e.Id).HasMaxLength(50);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.RecordDate).HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.StudentHealthRecordId).HasMaxLength(50);
            entity.Property(e => e.StudentId).HasMaxLength(50);
            entity.Property(e => e.Vaccine).HasMaxLength(50);

            entity.HasOne(d => d.StudentHealthRecord).WithMany(p => p.Vaccinerecords)
                .HasForeignKey(d => d.StudentHealthRecordId)
                .HasConstraintName("FK_VaccineRecord_StudentHealthRecord");

            entity.HasOne(d => d.Student).WithMany(p => p.Vaccinerecords)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK_VaccineRecord_Student");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
