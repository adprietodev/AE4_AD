<?php
	if(isset($_POST["id"])){
		$id = $_POST["id"];
		$name = $_POST["name"];
		$image = $_POST["image"];
		$hp = $_POST["hp"];
		$attack = $_POST["attack"];
		$defense = $_POST["defense"];
		$special_attack = $_POST["special_attack"];
		$special_defense = $_POST["special_defense"];
		$speed = $_POST["speed"];
		$type_01 = $_POST["type_01"];
		$type_02 = $_POST["type_02"];
		$servidor = "localhost";
		$usuario = "root";
		$password = "";
		$dbname = "pokemons";
		$conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
		if (!$conexion) {
			echo "Error en la conexion a MySQL: ".mysqli_connect_error();
			exit();
		}
		$sql = "INSERT INTO pokemonsCards (id, name,image,stat_hp,stat_attack,stat_defense,stat_special_attack,stat_special_defense,stat_speed,type_01,type_02) VALUES ('".$id."','".$name."','".$image."','".$hp."','".$attack."','".$defense."','".$special_attack."','".$special_defense."','".$speed."','".$type_01."','".$type_02."')";

		if (mysqli_query($conexion, $sql)) {
			echo "Registro insertado correctamente.";
		} else {
			echo "Error: " . $sql . "<br>" . mysqli_error($conexion);
		}
	}

    if(isset($_GET["name"])) {
        $name = $_GET["name"];
        
        $servidor = "localhost";
        $usuario = "root";
        $password = "";
        $dbname = "pokemons";
        $conexion = mysqli_connect($servidor, $usuario, $password, $dbname);
        
        if (!$conexion) {
            echo "Error en la conexión a MySQL: " . mysqli_connect_error();
            exit();
        }
        
        $sql = "SELECT * FROM pokemonsCards WHERE name LIKE ?";
		$stmt = $conexion->prepare($sql);

		// Agregar el comodín % a la cadena de búsqueda
		$searchTerm = '%' . $name . '%';

		$stmt->bind_param("s", $searchTerm);
		$stmt->execute();

		$result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
			// Convertir resultados a un array asociativo y luego a formato JSON
			$data = $result->fetch_all(MYSQLI_ASSOC);
			echo json_encode($data);
		} else {
			echo json_encode(array('message' => 'No se encontraron resultados'));
		}
        
        // Cerrar la conexión a la base de datos
        mysqli_close($conexion);
    } else {
        echo "Parámetro 'nombre' no proporcionado en la URL.";
    }

?>