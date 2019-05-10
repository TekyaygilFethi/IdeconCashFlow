using IdeconCashFlow.Data.POCO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace IdeconCashFlow.Database.ContextFolder
{
    public class IdeconCashFlowDbContext:DbContext
    {
        public IdeconCashFlowDbContext():base()
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Baslik>()
                .HasMany(m => m.Kalemler)
                .WithOne(o => o.Baslik)
                .HasForeignKey(fk => fk.BaslikHesapNo)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Baslik>()
                .HasOne(o => o.Duzenleyen)
                .WithMany(m => m.DuzenlenenBasliklar)
                .HasForeignKey(fk => fk.DuzenleyenUserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Kalem>()
                .HasOne(o => o.Duzenleyen)
                .WithMany(m => m.DuzenlenenKalemler)
                .HasForeignKey(fk => fk.DuzenleyenUserID)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
