using Microsoft.EntityFrameworkCore.Migrations;

namespace IdeconCashFlow.Database.Migrations
{
    public partial class AddSortOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SirketKodu",
                table: "UserTable",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SirketKodu",
                table: "UserTable");
        }
    }
}
