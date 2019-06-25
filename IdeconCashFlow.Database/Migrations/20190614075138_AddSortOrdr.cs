using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IdeconCashFlow.Database.Migrations
{
    public partial class AddSortOrdr : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ParaBirimleri",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Kur = table.Column<string>(nullable: true),
                    Symbol = table.Column<string>(nullable: true),
                    SymbolNative = table.Column<string>(nullable: true),
                    DecimalDigits = table.Column<int>(nullable: false),
                    Rounding = table.Column<double>(nullable: false),
                    Code = table.Column<string>(nullable: true),
                    NamePlural = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParaBirimleri", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TekliBasliklar",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false),
                    FlowDirectionSymbol = table.Column<string>(nullable: true),
                    FlowDirectionExplanation = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true),
                    AnaBaslikID = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TekliBasliklar", x => x.ID);
                    table.UniqueConstraint("AK_TekliBasliklar_AnaBaslikID", x => x.AnaBaslikID);
                });

            migrationBuilder.CreateTable(
                name: "UserTable",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    KullanıcıAdı = table.Column<string>(name: "Kullanıcı Adı", nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Surname = table.Column<string>(nullable: true),
                    Şifre = table.Column<string>(nullable: false),
                    Yetki = table.Column<string>(nullable: true),
                    SirketKodu = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTable", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ParaBirimiKalemler",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false),
                    ParaBirimiID = table.Column<int>(nullable: false),
                    Tutar = table.Column<double>(nullable: false),
                    ParaBirimiKalemID = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParaBirimiKalemler", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ParaBirimiKalemler_ParaBirimleri_ParaBirimiID",
                        column: x => x.ParaBirimiID,
                        principalTable: "ParaBirimleri",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AnaBasliklar",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false),
                    BaslikTanimi = table.Column<string>(maxLength: 100000, nullable: true),
                    IsVadeIliskili = table.Column<bool>(nullable: false),
                    SirketKodu = table.Column<string>(nullable: true),
                    TekliBaslikID = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnaBasliklar", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AnaBasliklar_TekliBasliklar_TekliBaslikID",
                        column: x => x.TekliBaslikID,
                        principalTable: "TekliBasliklar",
                        principalColumn: "AnaBaslikID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ParaBirimiTutarlar",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ParaBirimiID = table.Column<int>(nullable: false),
                    Tutar = table.Column<double>(nullable: false),
                    TekliBaslikID = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParaBirimiTutarlar", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ParaBirimiTutarlar_ParaBirimleri_ParaBirimiID",
                        column: x => x.ParaBirimiID,
                        principalTable: "ParaBirimleri",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParaBirimiTutarlar_TekliBasliklar_TekliBaslikID",
                        column: x => x.TekliBaslikID,
                        principalTable: "TekliBasliklar",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "KalemTable",
                columns: table => new
                {
                    KalemID = table.Column<string>(nullable: false),
                    FaturaTarihi = table.Column<DateTime>(nullable: false),
                    VadeTarihi = table.Column<DateTime>(nullable: false),
                    DuzenlemeTarihi = table.Column<DateTime>(nullable: true),
                    EklemeTarihi = table.Column<DateTime>(nullable: false),
                    DuzenleyenUserID = table.Column<int>(nullable: true),
                    EkleyenUserID = table.Column<int>(nullable: true),
                    IsTahmin = table.Column<bool>(nullable: false),
                    Aciklama = table.Column<string>(nullable: true),
                    TekliBaslikID = table.Column<string>(nullable: true),
                    AnaBaslikID = table.Column<string>(nullable: true),
                    ParaBirimiKalemID = table.Column<string>(nullable: true),
                    IsUserCreation = table.Column<bool>(nullable: false),
                    KalemTipiAciklama = table.Column<string>(nullable: true),
                    KalemTipiSymbol = table.Column<string>(nullable: true),
                    Tutar = table.Column<double>(nullable: false),
                    EkAlan1 = table.Column<string>(nullable: true),
                    EkAlan2 = table.Column<string>(nullable: true),
                    EkAlan3 = table.Column<string>(nullable: true),
                    EkAlan4 = table.Column<string>(nullable: true),
                    EkAlan5 = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KalemTable", x => x.KalemID);
                    table.ForeignKey(
                        name: "FK_KalemTable_AnaBasliklar_AnaBaslikID",
                        column: x => x.AnaBaslikID,
                        principalTable: "AnaBasliklar",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KalemTable_UserTable_DuzenleyenUserID",
                        column: x => x.DuzenleyenUserID,
                        principalTable: "UserTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KalemTable_UserTable_EkleyenUserID",
                        column: x => x.EkleyenUserID,
                        principalTable: "UserTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KalemTable_ParaBirimiKalemler_ParaBirimiKalemID",
                        column: x => x.ParaBirimiKalemID,
                        principalTable: "ParaBirimiKalemler",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KalemTable_TekliBasliklar_TekliBaslikID",
                        column: x => x.TekliBaslikID,
                        principalTable: "TekliBasliklar",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnaBasliklar_TekliBaslikID",
                table: "AnaBasliklar",
                column: "TekliBaslikID",
                unique: true,
                filter: "[TekliBaslikID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_KalemTable_AnaBaslikID",
                table: "KalemTable",
                column: "AnaBaslikID");

            migrationBuilder.CreateIndex(
                name: "IX_KalemTable_DuzenleyenUserID",
                table: "KalemTable",
                column: "DuzenleyenUserID");

            migrationBuilder.CreateIndex(
                name: "IX_KalemTable_EkleyenUserID",
                table: "KalemTable",
                column: "EkleyenUserID");

            migrationBuilder.CreateIndex(
                name: "IX_KalemTable_ParaBirimiKalemID",
                table: "KalemTable",
                column: "ParaBirimiKalemID",
                unique: true,
                filter: "[ParaBirimiKalemID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_KalemTable_TekliBaslikID",
                table: "KalemTable",
                column: "TekliBaslikID");

            migrationBuilder.CreateIndex(
                name: "IX_ParaBirimiKalemler_ParaBirimiID",
                table: "ParaBirimiKalemler",
                column: "ParaBirimiID");

            migrationBuilder.CreateIndex(
                name: "IX_ParaBirimiTutarlar_ParaBirimiID",
                table: "ParaBirimiTutarlar",
                column: "ParaBirimiID");

            migrationBuilder.CreateIndex(
                name: "IX_ParaBirimiTutarlar_TekliBaslikID",
                table: "ParaBirimiTutarlar",
                column: "TekliBaslikID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KalemTable");

            migrationBuilder.DropTable(
                name: "ParaBirimiTutarlar");

            migrationBuilder.DropTable(
                name: "AnaBasliklar");

            migrationBuilder.DropTable(
                name: "UserTable");

            migrationBuilder.DropTable(
                name: "ParaBirimiKalemler");

            migrationBuilder.DropTable(
                name: "TekliBasliklar");

            migrationBuilder.DropTable(
                name: "ParaBirimleri");
        }
    }
}
