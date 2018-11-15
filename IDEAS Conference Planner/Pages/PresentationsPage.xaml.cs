using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace IDEAS_Conference_Planner.Pages
{
    /// <summary>
    /// Interaction logic for PresentationsPage.xaml
    /// </summary>
    /// 


    public class Presentation
    {
        public string title { get; set; }
        public string abstractSummary { get; set; }
        public string bio { get; set; }
        public string authors { get; set; }
        public string cat { get; set; }
        public string demographics { get; set; }
        public int rating1 { get; set; }
        public int rating2 { get; set; }
    }
    public partial class PresentationsPage : Page
    {
        public PresentationsPage()
        {
            InitializeComponent();
            datagridpresentations.ItemsSource = LoadCollectionData(); 
        }

        private void Burger_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/HomePage.xaml", UriKind.Relative));
        }
        
        private void HomeView_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/HomePage.xaml", UriKind.Relative));
        }

        private void PresentationsView_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/PresentationsPage.xaml", UriKind.Relative));
        }

        private void AttendeesView_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/AttendeesPage.xaml", UriKind.Relative));
        }

        private void MailView_Click(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start("mailto:");
        }

        private List<Presentation> LoadCollectionData()
        {
            List<Presentation> presentations = new List<Presentation>();
            presentations.Add(new Presentation()
            {
                title = "The growing industry",
                abstractSummary = "Throughout the years...",
                bio = "Bill is a special needs...",
                authors = "Bill White",
                cat = "Behavioral",
                demographics = "White/Latino",
                rating1 = 10,
                rating2 = -1
            });

            presentations.Add(new Presentation()
            {
                title = "In spite of the...",
                abstractSummary = "Due to the growing trend...",
                bio = "Gina is a single mom...",
                authors = "Gina Lazarus",
                cat = "Co-teaching",
                demographics = "Black",
                rating1 = 28,
                rating2 = -1
            });

            presentations.Add(new Presentation()
            {
                title = "For the development...",
                abstractSummary = "During early adolescence...",
                bio = "Paul lives in Alpharetta...",
                authors = "Paul Blanche",
                cat = "Autism",
                demographics = "Asian",
                rating1 = 22,
                rating2 = -1
            });

            return presentations;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            //Presentation sp = datagridpresentations.SelectedItem as Presentation;
            //sp.rating2 = 25;
            //datagridpresentations.Items.Refresh();
            NavigationService.Navigate(new Uri("/Pages/ratingwindow.xaml", UriKind.Relative));




        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/scheduler.xaml", UriKind.Relative));
        }
    }
}

