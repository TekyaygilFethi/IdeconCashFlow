using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace IdeconCashFlow.Data.POCO
{
    [Table("UserTable")]
    public class User
    {
        public User()
        {
            EklenenKalemler = new List<Kalem>();
            DuzenlenenKalemler = new List<Kalem>();
        }

        [Key,DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Column("Kullanıcı Adı")]
        [Required]
        //[Index(IsUnique =true)]
        public string Username { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        [Column("Şifre")]
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        
        public string Yetki { get; set; }
        
        public virtual List<Kalem> EklenenKalemler { get; set; }

        public virtual List<Kalem> DuzenlenenKalemler { get; set; }
    }
}
