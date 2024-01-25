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
?>