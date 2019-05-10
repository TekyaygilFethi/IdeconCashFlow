using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IdeconCashFlow.Data.POCO
{

    [Table("BaslikTable")]
    public class Baslik : BasePOCO
    {
        public Baslik()
        {
            Kalemler = new List<Kalem>();
        }

        [Column("Başlık Tipi")]
        public char BaslikType { get; set; }

        [Column("Bakiye")]
        public double Bakiye { get; set; }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        //[Index(IsUnique =true)]
        [MaxLength(1000)]
        public double HesapNo { get; set; }

        public virtual List<Kalem> Kalemler { get; set; }

    }
}
