import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    MessageBox,
    Container,
    Aside,
    Menu,
    Submenu,
    MenuItem,
    Header,
    Main,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Dialog,
    Pagination,
    Select,
    Option,
    Calendar,
    Upload,
    Progress,
    Carousel,
    CarouselItem,

} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Header)
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Calendar)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Carousel)
Vue.use(CarouselItem)
// 全局挂载 Message
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
