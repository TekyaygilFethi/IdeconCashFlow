using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IdeconCashFlow.Database.Migrations.IdeconCashflowMySqlDb
{
    public partial class Mig1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ParaBirimiTable",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
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
                    table.PrimaryKey("PK_ParaBirimiTable", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TekliBaslikTable",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false),
                    FlowDirectionSymbol = table.Column<string>(nullable: true),
                    FlowDirectionExplanation = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TekliBaslikTable", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "UserTable",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Surname = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: false),
                    Yetki = table.Column<string>(nullable: true),
                    SirketKodu = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTable", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ParaBirimiKalemTable",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false),
                    KalemID = table.Column<string>(nullable: false),
                    ParaBirimiID = table.Column<int>(nullable: false),
                    Tutar = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParaBirimiKalemTable", x => x.ID);
                    table.UniqueConstraint("AK_ParaBirimiKalemTable_KalemID", x => x.KalemID);
                    table.ForeignKey(
                        name: "FK_ParaBirimiKalemTable_ParaBirimiTable_ParaBirimiID",
                        column: x => x.ParaBirimiID,
                        principalTable: "ParaBirimiTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AnaBaslikTable",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false),
                    BaslikTanimi = table.Column<string>(maxLength: 10000, nullable: true),
                    IsVadeIliskili = table.Column<bool>(nullable: false),
                    SirketKodu = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnaBaslikTable", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AnaBaslikTable_TekliBaslikTable_ID",
                        column: x => x.ID,
                        principalTable: "TekliBaslikTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ParaBirimiTutarTable",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ParaBirimiID = table.Column<int>(nullable: false),
                    Tutar = table.Column<double>(nullable: false),
                    TekliBaslikID = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParaBirimiTutarTable", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ParaBirimiTutarTable_ParaBirimiTable_ParaBirimiID",
                        column: x => x.ParaBirimiID,
                        principalTable: "ParaBirimiTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ParaBirimiTutarTable_TekliBaslikTable_TekliBaslikID",
                        column: x => x.TekliBaslikID,
                        principalTable: "TekliBaslikTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "KalemTable",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false),
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
                    table.PrimaryKey("PK_KalemTable", x => x.ID);
                    table.ForeignKey(
                        name: "FK_KalemTable_AnaBaslikTable_AnaBaslikID",
                        column: x => x.AnaBaslikID,
                        principalTable: "AnaBaslikTable",
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
                        name: "FK_KalemTable_ParaBirimiKalemTable_ParaBirimiKalemID",
                        column: x => x.ParaBirimiKalemID,
                        principalTable: "ParaBirimiKalemTable",
                        principalColumn: "KalemID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KalemTable_TekliBaslikTable_TekliBaslikID",
                        column: x => x.TekliBaslikID,
                        principalTable: "TekliBaslikTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

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
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_KalemTable_TekliBaslikID",
                table: "KalemTable",
                column: "TekliBaslikID");

            migrationBuilder.CreateIndex(
                name: "IX_ParaBirimiKalemTable_ParaBirimiID",
                table: "ParaBirimiKalemTable",
                column: "ParaBirimiID");

            migrationBuilder.CreateIndex(
                name: "IX_ParaBirimiTutarTable_ParaBirimiID",
                table: "ParaBirimiTutarTable",
                column: "ParaBirimiID");

            migrationBuilder.CreateIndex(
                name: "IX_ParaBirimiTutarTable_TekliBaslikID",
                table: "ParaBirimiTutarTable",
                column: "TekliBaslikID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KalemTable");

            migrationBuilder.DropTable(
                name: "ParaBirimiTutarTable");

            migrationBuilder.DropTable(
                name: "AnaBaslikTable");

            migrationBuilder.DropTable(
                name: "UserTable");

            migrationBuilder.DropTable(
                name: "ParaBirimiKalemTable");

            migrationBuilder.DropTable(
                name: "TekliBaslikTable");

            migrationBuilder.DropTable(
                name: "ParaBirimiTable");
        }
    }
}
