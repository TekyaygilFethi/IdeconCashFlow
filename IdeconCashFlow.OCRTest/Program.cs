using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

namespace IdeconCashFlow.OCRTest
{
    class Program
    {
        static void Main(string[] args)
        {
            
            //var Ocr = new AutoOcr();
            //var res= Ocr.Read(@"C:\Users\IDECON5\source\repos\IdeconCashflowLAST\IdeconCashFlow-master\IdeconCashFlow.OCRTest\OCRDeneme.JPG");
            //Console.WriteLine(res.Text);
            // now add the following C# line in the code page  
            var image = new Bitmap(@"Z:\NewProject\demo\image.bmp");
            varocr = new Tesseract();
            ocr.Init(@ "Z:\NewProject\How to use Tessnet2 library\C#\tessdata", "eng", false);
            var result = ocr.DoOCR(image, Rectangle.Empty);
            foreach (tessnet2.Word word in result)
            {
                Console.Writeline(word.text);
            }
            Console.WriteLine("Hello World!");

            Console.ReadLine();
        }
    }
}
