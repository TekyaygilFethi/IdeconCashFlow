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
        [Column("Kullanıcı Adı")]
        [Required]
        //[Index(IsUnique =true)]
        public string Username { get; set; }

        [Column("Şifre")]
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        
        public string Yetki { get; set; }

        public virtual List<Baslik> DuzenlenenBasliklar { get; set; }

        public virtual List<Kalem> DuzenlenenKalemler { get; set; }
    }
}
