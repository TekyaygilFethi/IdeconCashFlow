using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IdeconCashFlow.Data.POCO
{
    [Table("KalemTable")]
    public class Kalem:BasePOCO
    {

        
        [ForeignKey("BaslikAccountNo")]
        public virtual Baslik Baslik { get; set; }

        public int BaslikHesapNo { get; set; }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        //[Index(IsUnique =true)]
        [MaxLength(1000)]
        public int AltBaslikHesapNo { get; set; }

        [Column("FaturaTarihi")]
        public DateTime FaturaTarihi { get; set; }

        [Column("VadeTarihi")]
        public DateTime VadeTarihi { get; set; }

        public bool IsTahmin { get; set; }
    }
}
