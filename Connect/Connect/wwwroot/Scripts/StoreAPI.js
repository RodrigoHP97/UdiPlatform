
var config = new Object();
$(document).ready(function () {
    load_config();
    
});

function load_config() {
    var obj;
    const jconf =
        fetch("/Configurations/StoreConfigurator.json")
            .then(response => {
                return response.json();
            })
            .then(data => obj = data)
            .then(() => config = obj);

}


class StoreConfig extends React.Component {

    loadForm() {

    const [form, setForm] = useState({});

    const handleChange = e => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })
    }

    const handleChecked = e => {
        setForm({
            ...form, [e.target.name]: e.target.checked
        })
    }

}

    render() {
        return  (<div>IField : Componente No Implementado.</div>);
    }

}
