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
    /// Interaction logic for addingrows.xaml
    /// </summary>
    public partial class ratingwindow : Page
    {
        public ratingwindow()
        {
            InitializeComponent();
        }

        private void finishrating_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate(new Uri("/Pages/PresentationsPage.xaml", UriKind.Relative));
        }
    }
}
