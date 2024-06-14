let currentPage = 1;
const rowsPerPage=25;
let filteredRows = [];
        function deleteRecord(id){
            if(confirm("Jeste li sigurni da želite obrisati zapisnik s ID-jem: " + id + "?")) {
                fetch('/delete/' + id, {
                    method:'DELETE'
                }).then(response => {
                    if (response.ok){
                        alert("Record deleted successfully.");
                        location.reload();
                    } else {
                        throw new Error('Failed to delete record.');
                    }
                }).catch(error => {
                    console.error('Error deleting record:', error);
                    alert("Failed to delete record.");
                });
            }
        }

        function addDeleteButtonToRow(row, id) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = '<img src="delete.png" alt="Delete">';
            deleteButton.addEventListener('click', function() {
                deleteRecord(id);
            });
            row.appendChild(deleteButton);
        }

        function addEditButtonToRow(row, id){
            const editButton = document.createElement('button');
            editButton.className='delete-button';
            editButton.innerHTML = '<a href="edit.html?id=' + id + '"><img src="edit.png" alt="Edit"></a>';
            row.appendChild(editButton);
        }


        function filterList(){
            const input = document.getElementById('searchNaselje');
            const filter = input.value.toUpperCase();
            const table = document.getElementById('table');
            const minDate = document.getElementById('minDate').value;
            const maxDate = document.getElementById('maxDate').value;
            const rows = table.getElementsByTagName('tr');
           
            filteredRows = [];

            for (let i = 0; i < rows.length; i++){
                const naseljeCells = rows[i].getElementsByTagName('td')[3];
                const datumCells = rows[i].getElementsByTagName('td')[4]
                if (naseljeCells && datumCells){

                    const textValueNaselje = naseljeCells.textContent || naseljeCells.innerText;
                    const textValueDatum = datumCells.textContent || datumCells.innerText;
                    

                    if (textValueDatum.length === 10) {
                    // mm/dd/yyyy
                       
                        let d = '';
                        d += textValueDatum.slice(0, 2) + "/" + textValueDatum.slice(3, 5) + "/" + textValueDatum.slice(6) ;
                        //console.log(d);
                        datum = new Date(d);
                        
                    }   else if (textValueDatum.length === 9) {
                    //  m/dd/yyyy 
                        
                        datum = new Date(textValueDatum.replace(/(\d{1})\/(\d{2})\/(\d{4})/, '$2/0$1/$3'));
                }
                    //console.log(textValueNaselje, textValueDatum,typeof textValueDatum, datum, textValueNaselje.toUpperCase().indexOf(filter) > -1, (!minDate || datum >= new Date(minDate)), (!maxDate || datum <= new Date(maxDate)));
                    if ((textValueNaselje.toUpperCase().indexOf(filter) > -1) && (!minDate || datum >= new Date(minDate)) && (!maxDate || datum <= new Date(maxDate))){
                        rows[i].style.display = ''
                    } else{
                        rows[i].style.display = 'none'
                    }
                }
            }
        }
       




        document.getElementById('minDate').addEventListener('input', filterList)
        document.getElementById('maxDate').addEventListener('input', filterList)
        document.getElementById('createButton').addEventListener('click', function() {
            window.location.href = '/create';
        });
        document.getElementById('mapButton').addEventListener('click', function() {
            window.location.href = "/osm";
        });
