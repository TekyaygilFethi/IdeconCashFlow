using IdeconCashFlow.Data.POCO;
using Microsoft.EntityFrameworkCore;

namespace IdeconCashFlow.Database.ContextFolder
{
    public class IdeconCashFlowDbContext : DbContext
    {
        public IdeconCashFlowDbContext() : base()
        {

        }

        public IdeconCashFlowDbContext(DbContextOptions options) : base()
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
                .HasForeignKey<Kalem>(fk=>fk.ParaBirimiKalemID)
                .HasPrincipalKey<ParaBirimiKalem>(pk=>pk.ID)
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
                .HasForeignKey<AnaBaslik>(fk=>fk.TekliBaslikID)
                .HasPrincipalKey<TekliBaslik>(fk=>fk.AnaBaslikID)
                .OnDelete(DeleteBehavior.Restrict);
            #endregion
        }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            //builder.UseSqlServer(@"Data Source=.\SQLEXPRESS;Initial Catalog=IdeconCashFlowDatabase;Integrated Security=True");
            builder.UseSqlServer(@"Server=4d296a8c-776a-40ed-8de9-aa5e00cb3b8b.sqlserver.sequelizer.com;Database=db4d296a8c776a40ed8de9aa5e00cb3b8b;User ID=tralejihdnhczgks;Password=FcUeNvojhJi4JtYFLZQ2ePxYtYFAvrWrQt436FjxzXtHozQWPSBeFEPZM5TXWUVY;");
            builder.UseLazyLoadingProxies();
            base.OnConfiguring(builder);
        }

    }
}
