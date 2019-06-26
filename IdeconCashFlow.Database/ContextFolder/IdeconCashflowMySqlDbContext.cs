using IdeconCashFlow.Data.POCO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using System;

namespace IdeconCashFlow.Database.ContextFolder
{
    public class IdeconCashflowMySqlDbContext : DbContext
    {
        public static ILoggerFactory LoggerFactory { get; } = new LoggerFactory(new[] {
              new ConsoleLoggerProvider((_, __) => true, true)
        });
        public IdeconCashflowMySqlDbContext() : base()
        {

        }

        public IdeconCashflowMySqlDbContext(DbContextOptions options) : base()
        {

        }

        public DbSet<AnaBaslik> AnaBasliklar { get; set; }
        public DbSet<Kalem> Kalemler { get; set; }
        public DbSet<ParaBirimi> ParaBirimleri { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ParaBirimiKalem> ParaBirimiKalemler { get; set; }
        public DbSet<TekliBaslik> TekliBasliklar { get; set; }
        public DbSet<ParaBirimiTutar> ParaBirimiTutarlar { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach(var entityType in modelBuilder.Model.GetEntityTypes())
                foreach (var property in entityType.GetProperties())
                if (property.ClrType == typeof(Nullable<bool>) || property.ClrType == typeof(Nullable<Boolean>))
                    property.SetValueConverter(new BoolToZeroOneConverter<Nullable<Int16>>());



            #region Kalem FLUENT API
            modelBuilder.Entity<Kalem>()
                .HasOne(o => o.Duzenleyen)
                .WithMany(m => m.DuzenlenenKalemler)
                .HasForeignKey(fk => fk.DuzenleyenUserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Kalem>()
                .HasOne(o => o.Ekleyen)
                .WithMany(m => m.EklenenKalemler)
                .HasForeignKey(fk => fk.EkleyenUserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Kalem>()
                .HasOne(o => o.AnaBaslik)
                .WithMany(m => m.Kalemler)
                .HasForeignKey(fk => fk.AnaBaslikID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Kalem>()
                .HasOne(m => m.ParaBirimiKalem)
                .WithOne(o => o.Kalem)
                .HasForeignKey<Kalem>(fk => fk.ParaBirimiKalemID)
                .HasPrincipalKey<ParaBirimiKalem>(pk => pk.KalemID)
                .OnDelete(DeleteBehavior.Cascade);


            #endregion

            #region ParaBirimi FLUENT API
            modelBuilder.Entity<ParaBirimi>()
                .HasMany(m => m.ParaBirimiKalemler)
                .WithOne(o => o.ParaBirimi)
                .HasForeignKey(fk => fk.ParaBirimiID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ParaBirimi>()
                .HasMany(m => m.ParaBirimiTutarlar)
                .WithOne(o => o.ParaBirimi)
                .HasForeignKey(fk => fk.ParaBirimiID)
                .OnDelete(DeleteBehavior.Restrict);
            #endregion

            #region Tekli Baslik FLUENT API
            modelBuilder.Entity<TekliBaslik>()
                .HasMany(m => m.Currencies)
                .WithOne(o => o.TekliBaslik)
                .HasForeignKey(fk => fk.TekliBaslikID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TekliBaslik>()
                .HasMany(m => m.Kalemler)
                .WithOne(o => o.TekliBaslik)
                .HasForeignKey(fk => fk.TekliBaslikID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TekliBaslik>()
                .HasOne(m => m.AnaBaslik)
                .WithOne(o => o.TekliBaslik)
                .HasForeignKey<AnaBaslik>(fk => fk.ID)
                .HasPrincipalKey<TekliBaslik>(fk => fk.ID)
                .OnDelete(DeleteBehavior.Restrict);
            #endregion}
        }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            builder.UseMySql(@"server=localhost;database=IdeconCashflowDapperDb;user=root;password=Idecon1*");
            //builder.UseMySql(@"server=00df25b4-efcf-4318-9370-aa6900ab767e.mysql.sequelizer.com;database=db00df25b4efcf43189370aa6900ab767e;uid=sfelytbmvctnjpof;pwd=NRk3HF4qtPJFfbooELqGxCXUkz2cTmBf8g3swtKkr3gskEwYZG8TtbXk2xRhMZDh");
            //builder.UseSqlServer(@"Server=4d296a8c-776a-40ed-8de9-aa5e00cb3b8b.sqlserver.sequelizer.com;Database=db4d296a8c776a40ed8de9aa5e00cb3b8b;User ID=tralejihdnhczgks;Password=FcUeNvojhJi4JtYFLZQ2ePxYtYFAvrWrQt436FjxzXtHozQWPSBeFEPZM5TXWUVY;");
            builder.UseLoggerFactory(LoggerFactory)  //tie-up DbContext with LoggerFactory object
            .EnableSensitiveDataLogging();
            builder.UseLazyLoadingProxies();
            base.OnConfiguring(builder);
        }
    }
}
