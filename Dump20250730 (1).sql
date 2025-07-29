-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: metro.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ACTOR`
--

DROP TABLE IF EXISTS `ACTOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ACTOR` (
  `ACTOR_ID` int NOT NULL AUTO_INCREMENT,
  `ACTOR_FIRSTNAME` varchar(50) DEFAULT NULL,
  `ACTOR_LASTNAME` varchar(50) DEFAULT NULL,
  `BIOGRAPHY` varchar(500) DEFAULT NULL,
  `PICTURE` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ACTOR_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ACTOR`
--

LOCK TABLES `ACTOR` WRITE;
/*!40000 ALTER TABLE `ACTOR` DISABLE KEYS */;
INSERT INTO `ACTOR` VALUES (1,'Robert','Downey Jr.','American actor best known for portraying Iron Man in the Marvel Cinematic Universe.','rdj.jpg'),(2,'Scarlett','Johansson','American actress who played Black Widow in the Marvel franchise.','scarlett.jpg'),(3,'Chris','Evans','American actor famous for his role as Captain America.','chrisevans.jpg'),(4,'Mark','Ruffalo','American actor known for portraying Hulk in the MCU.','markruffalo.jpg'),(5,'Chris','Hemsworth','Australian actor best known for his role as Thor.','chrishemsworth.jpg'),(6,'Jeremy','Renner','American actor who played Hawkeye in the MCU.','jeremyrenner.jpg'),(7,'Tom','Holland','British actor who portrays Spider-Man in the MCU.','tomholland.jpg'),(8,'Zendaya','Coleman','American actress and singer known for Euphoria and Spider-Man films.','zendaya.jpg'),(9,'Benedict','Cumberbatch','British actor who plays Doctor Strange in the MCU.','benedict.jpg'),(10,'Elizabeth','Olsen','American actress who plays Wanda Maximoff in Marvel series and movies.','elizabetholsen.jpg'),(11,'Paul','Rudd','American actor best known as Ant-Man in the Marvel franchise.','paulrudd.jpg'),(12,'Brie','Larson','American actress known for playing Captain Marvel.','brielarson.jpg'),(13,'Chadwick','Boseman','American actor who played Black Panther in the MCU.','chadwick.jpg'),(14,'Michael','B. Jordan','American actor who portrayed Erik Killmonger in Black Panther.','michaelbjordan.jpg'),(15,'Lupita','Nyongo','Kenyan-Mexican actress known for her role in Black Panther.','lupita.jpg'),(16,'Danai','Gurira','American-Zimbabwean actress who played Okoye in the MCU.','danai.jpg'),(17,'Ryan','Reynolds','Canadian actor famous for playing Deadpool.','ryanreynolds.jpg'),(18,'Hugh','Jackman','Australian actor known for his role as Wolverine.','hughjackman.jpg'),(19,'Emma','Stone','Academy Award-winning actress known for La La Land and Easy A.','emmastone.jpg'),(20,'Ryan','Gosling','Canadian actor known for Blade Runner 2049 and La La Land.','ryangosling.jpg'),(21,'Margot','Robbie','Australian actress known for Barbie and Harley Quinn roles.','margotrobbie.jpg'),(22,'Timothée','Chalamet','American actor starring in Dune and Call Me by Your Name.','timothee.jpg'),(24,'Oscar','Isaac','Guatemalan-American actor known for Dune and Star Wars.','oscarisaac.jpg'),(25,'Jason','Momoa','American actor best known for Aquaman and Dune.','jasonmomoa.jpg'),(26,'Frances','McDormand','Frances McDormand is an American actress known for her work in independent and mainstream films. She has received multiple awards including several Academy Awards.','frances_mcdormand.jpg'),(27,'David','Strathairn','David Strathairn is an American actor known for his work in film, television, and theater. He received an Academy Award nomination for his performance in Good Night, and Good Luck.','david_strathairn.jpg'),(28,'Emilia','Jones','Emilia Jones is an English actress and singer. She is best known for her role in CODA, which earned critical acclaim and multiple awards.','emilia_jones.jpg'),(29,'Troy','Kotsur','Troy Kotsur is an American stage and screen actor and director. He won acclaim for his role in CODA, becoming the first deaf male actor to win an Academy Award.','troy_kotsur.jpg'),(30,'Song','Kang-ho','Song Kang-ho is a South Korean actor known for his roles in films such as Parasite and Snowpiercer. He is one of South Korea\'s most acclaimed actors.','song_kang-ho.jpg'),(31,'Lee','Sun-kyun','Lee Sun-kyun is a South Korean actor known for his roles in Parasite and other popular films and television dramas.','lee_sun-kyun.jpg'),(32,'Sally','Hawkins','Sally Hawkins is a British actress known for her versatile performances in film and theater. She starred in The Shape of Water and Happy-Go-Lucky.','sally_hawkins.jpg'),(33,'Michael','Shannon','Michael Shannon is an American actor and musician known for his roles in films such as Revolutionary Road and The Shape of Water.','michael_shannon.jpg'),(34,'Viggo','Mortensen','Viggo Mortensen is an American actor known for his work in films such as The Lord of the Rings trilogy and Green Book.','viggo_mortensen.jpg'),(35,'Mahershala','Ali','Mahershala Ali is an American actor known for his performances in Moonlight and Green Book, both of which won the Academy Award for Best Picture.','mahershala_ali.jpg'),(36,'Gabriel','LaBelle','Gabriel LaBelle is a Canadian actor known for his leading role in The Fabelmans, directed by Steven Spielberg.','gabriel_labelle.jpg'),(37,'Michelle','Williams','Michelle Williams is an American actress acclaimed for her performances in films and television, including The Fabelmans and Dawson\'s Creek.','michelle_williams.jpg'),(38,'Cate','Blanchett','Cate Blanchett is an Australian actress known for her diverse roles in film, theater, and television, including Tár and Elizabeth.','cate_blanchett.jpg'),(39,'Noémie','Merlant','Noémie Merlant is a French actress and director recognized for her roles in contemporary cinema including Portrait of a Lady on Fire.','noémie_merlant.jpg'),(40,'Ansel','Elgort','Ansel Elgort is an American actor and singer best known for his roles in The Fault in Our Stars and West Side Story.','ansel_elgort.jpg'),(41,'Rachel','Zegler','Rachel Zegler is an American actress and singer who made her breakthrough in the 2021 remake of West Side Story.','rachel_zegler.jpg'),(42,'Trevante','Rhodes','Trevante Rhodes is an American actor known for his leading role in Moonlight and other film and television appearances.','trevante_rhodes.jpg'),(43,'André','Holland','André Holland is an American actor known for his work in film, television, and theater, including his role in Moonlight.','andré_holland.jpg'),(44,'Leonardo','DiCaprio','Leonardo DiCaprio is an American actor and film producer widely regarded for his performances in Titanic, The Revenant, and The Departed.','leonardo_dicaprio.jpg'),(45,'Matt','Damon','Matt Damon is an American actor, producer, and screenwriter known for his roles in the Bourne series and The Departed.','matt_damon.jpg'),(46,'Cillian','Murphy','Cillian Murphy is an Irish actor known for his roles in Peaky Blinders, Inception, and 28 Days Later.','cillian_murphy.jpg'),(47,'Emily','Blunt','Emily Blunt is a British-American actress known for roles in The Devil Wears Prada, A Quiet Place, and Oppenheimer.','emily_blunt.jpg'),(49,'Keke','Palmer','Keke Palmer is an American actress and singer known for films and shows like Nope and Scream Queens.','keke_palmer.jpg'),(50,'Daniel','Kaluuya','Daniel Kaluuya is a British actor known for Get Out, Black Panther, and Nope.','daniel_kaluuya.jpg'),(51,'Rebecca','Ferguson','Rebecca Ferguson is a Swedish actress known for Mission: Impossible series and Dune.','rebecca_ferguson.jpg'),(52,'Stephanie','Hsu','Stephanie Hsu is an American actress known for Everything Everywhere All at Once.','stephanie_hsu.jpg'),(53,'Ke','Huy Quan','Ke Huy Quan is a Vietnamese-American actor known for Indiana Jones and the Temple of Doom and Everything Everywhere All at Once.','ke_huy_quan.jpg'),(54,'Winona','Ryder','Winona Ryder is an American actress known for Stranger Things and Beetlejuice.','winona_ryder.jpg'),(55,'David','Harbour','David Harbour is an American actor known for Stranger Things and Hellboy.','david_harbour.jpg'),(56,'Pedro','Pascal','Pedro Pascal is a Chilean-American actor known for The Mandalorian and Narcos.','pedro_pascal.jpg'),(57,'Gina','Carano','Gina Carano is an American actress and former mixed martial artist known for The Mandalorian.','gina_carano.jpg'),(58,'Steve','Carell','Steve Carell is an American actor and comedian known for The Office and The 40-Year-Old Virgin.','steve_carell.jpg'),(59,'Rainn','Wilson','Rainn Wilson is an American actor known for The Office and Super.','rainn_wilson.jpg'),(60,'Andy','Samberg','Andy Samberg is an American comedian and actor known for Brooklyn Nine-Nine and Saturday Night Live.','andy_samberg.jpg'),(61,'Terry','Crews','Terry Crews is an American actor and former football player known for Brooklyn Nine-Nine and Everybody Hates Chris.','terry_crews.jpg'),(62,'Bryan','Cranston','Bryan Cranston is an American actor known for Breaking Bad and Malcolm in the Middle.','bryan_cranston.jpg'),(63,'Aaron','Paul','Aaron Paul is an American actor known for Breaking Bad and BoJack Horseman.','aaron_paul.jpg'),(64,'Claire','Foy','Claire Foy is a British actress known for The Crown and First Man.','claire_foy.jpg'),(65,'Matt','Smith','Matt Smith is a British actor known for Doctor Who and The Crown.','matt_smith.jpg'),(66,'Helen','McCrory','Helen McCrory was a British actress known for Peaky Blinders and Harry Potter.','helen_mccrory.jpg'),(67,'Paul','Bettany','Paul Bettany is a British actor known for WandaVision and Avengers.','paul_bettany.jpg'),(68,'Karl','Urban','Karl Urban is a New Zealand actor known for The Boys and Star Trek.','karl_urban.jpg'),(69,'Jack','Quaid','Jack Quaid is an American actor known for The Boys and The Hunger Games.','jack_quaid.jpg'),(70,'Henry','Cavill','Henry Cavill is a British actor known for Superman and The Witcher.','henry_cavill.jpg'),(71,'Anya','Chalotra','Anya Chalotra is a British actress known for The Witcher.','anya_chalotra.jpg'),(72,'Joaquin','Phoenix','Joaquin Rafael Phoenix (born October 28, 1974) is an American actor. Widely described as one of the most preeminent actors of his generation and known for his roles as dark, unconventional and eccentric characters in independent film, he has received various accolades, including an Academy Award, a British Academy Film Award, a Grammy Award, and two Golden Globe Awards.','joaquin_phoenix.jpg'),(73,'Anthony','Hopkins','Sir Philip Anthony Hopkins (born December 31, 1937) is a Welsh actor. Considered one of Britain’s most recognisable and prolific actors, he is known for his performances on the screen and stage. Hopkins has received numerous accolades, including two Academy Awards, four BAFTA Awards, two Primetime Emmy Awards, and a Laurence Olivier Award.','anthony_hopkins.jpg'),(75,'Will','Smith','Willard Carroll Smith II (born September 25, 1968) is an American actor, rapper, and film producer. Known for his work in both the screen and music industries, his accolades include an Academy Award, a Golden Globe Award, a BAFTA Award, and four Grammy Awards. Films in which he has appeared have grossed over $10 billion worldwide, making him one of Hollywood’s most bankable stars.','will_smith.jpg'),(76,'Austin','Butler','Austin Robert Butler (born August 17, 1991) is an American actor, singer, and model. Butler began his career on television, first in roles on Disney Channel and Nickelodeon, most notably on Zoey 101 (2007–2008), and later on teen dramas, including recurring parts on The CW’s Life Unexpected (2010–2011) and Switched at Birth (2011–2012).','austin_butler.jpg'),(77,'Colin','Farrell','Colin James Farrell (born May 31, 1976) is an Irish actor. A leading man in blockbusters and independent films since the 2000s, he has received various accolades, including three Golden Globe Awards and a nomination for an Academy Award.','colin_farrell.jpg'),(78,'Paul','Giamatti','Paul Edward Valentine Giamatti (born June 6, 1967) is an American actor. His accolades include a Primetime Emmy Award and three Golden Globes, as well as nominations for two Academy Awards and a British Academy Film Award.','paul_giamatti.jpg'),(81,'Will','Smith','Willard Carroll Smith II (born September 25, 1968) is an American actor, rapper, and film producer. Known for his work in both the screen and music industries, his accolades include an Academy Award, a Golden Globe Award, a BAFTA Award, and four Grammy Awards. Films in which he has appeared have grossed over $10 billion worldwide, making him one of Hollywood’s most bankable stars.','will_smith.jpg'),(85,'Renée','Zellweger','Renée Kathleen Zellweger (born April 25, 1969) is an American actress. The recipient of various accolades, including two Academy Awards, two British Academy Film Awards, and four Golden Globe Awards, she was one of the world’s highest‑paid actresses by 2007.','renee_zellweger.jpg'),(86,'Andra','Day','Cassandra Monique Batie (born December 30, 1984), known professionally as Andra Day, is an American R&B and soul singer, songwriter, and actress. She is the recipient of various accolades, including a Grammy Award, a Children’s and Family Emmy Award, and a Golden Globe Award, along with a nomination for an Academy Award.','andra_day.jpg'),(87,'Jessica','Chastain','Jessica Michelle Chastain (born March 24, 1977) is an American actress and producer. Known for primarily starring in projects with feminist themes, she has received various accolades, including an Academy Award and a Golden Globe Award, in addition to nominations for a Primetime Emmy Award, two Tony Awards and two British Academy Film Awards. Time magazine named her one of the 100 most influential people in the world in 2012.','jessica_chastain.jpg'),(88,'Joanna','Scanlan','Joanna Marion Scanlan (born October 27, 1961) is a British actress and writer. On television, she is known for her roles in The Thick of It, Big School, Puppy Love, No Offence, Requiem, and The Larkins. She was nominated for three BAFTA TV Awards for Getting On, including two for Best Writing.','joanna_scanlan.jpg'),(89,'Nicole','Kidman','Nicole Mary Kidman (born June 20, 1967) is an American–Australian actress and producer. Known for her work across various film and television productions from several genres, she has consistently ranked among the world’s highest-paid actresses.','nicole_kidman.jpg'),(90,'Michelle','Yeoh','Yeoh Choo Kheng (born August 6, 1962), known professionally as Michelle Yeoh, is a Malaysian actress. In a career spanning over four decades, she has appeared in projects in a wide array of genres, and received various accolades, including an Academy Award and a Golden Globe Award, in addition to nominations for two BAFTA Awards. She rose to fame in Hong Kong action and martial arts films where she performed her own stunts.','michelle_yeoh.jpg'),(91,'Jamie Lee','Curtis','Jamie Lee Curtis (born November 22, 1958) is an American actress and author. Although at the beginning of her career she was known as a scream queen because of her roles in many horror movies, Curtis has since appeared in a variety of different movie genres.','jamie_lee_curtis.jpg'),(92,'Lily','Gladstone','Lily Gladstone (born August 2, 1986) is an American actress. Raised on the Blackfeet Reservation, Gladstone is of Piegan Blackfeet, Nez Perce, and European heritage and is known for playing Mollie Kyle in Martin Scorsese’s crime drama Killers of the Flower Moon (2023), winning a Golden Globe and a SAG Award, and earning an Academy Award nomination.','lily_gladstone.jpg'),(93,'Da’Vine','Joy Randolph','Da’Vine Joy Randolph (born May 21, 1986) is an American actress. She was named one of the 100 most influential people in the world by Time in 2024. Randolph gained recognition for her portrayal of psychic Oda Mae Brown in the Broadway production of Ghost (2012), and later earned praise for her roles in Dolemite Is My Name, The United States vs. Billie Holiday, and The Holdovers.','davine_joy_randolph.jpg'),(97,'Sydney','Sweeney','Sydney Bernice Sweeney (born September 12, 1997) is an American actress and producer. She gained early recognition for her roles in Everything Sucks!, The Handmaid\'s Tale, and Sharp Objects. She received wider acclaim for her performances in the drama series Euphoria (2019–present) and the first season of the anthology series The White Lotus (2021), both of which earned her nominations for two Primetime Emmy Awards.','sydney_sweeney-1753727664171.jpg');
/*!40000 ALTER TABLE `ACTOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ACTOR_AWARD`
--

DROP TABLE IF EXISTS `ACTOR_AWARD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ACTOR_AWARD` (
  `AWARD_ID` int NOT NULL,
  `ACTOR_ID` int NOT NULL,
  `SHOW_ID` int DEFAULT NULL,
  `YEAR` int NOT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`AWARD_ID`,`ACTOR_ID`,`YEAR`),
  KEY `FK_ACTOR_AWARD_ACTOR_ID` (`ACTOR_ID`),
  CONSTRAINT `FK_ACTOR_AWARD_ACTOR_ID` FOREIGN KEY (`ACTOR_ID`) REFERENCES `ACTOR` (`ACTOR_ID`),
  CONSTRAINT `FK_ACTOR_AWARD_AWARD_ID` FOREIGN KEY (`AWARD_ID`) REFERENCES `AWARD` (`AWARD_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ACTOR_AWARD`
--

LOCK TABLES `ACTOR_AWARD` WRITE;
/*!40000 ALTER TABLE `ACTOR_AWARD` DISABLE KEYS */;
INSERT INTO `ACTOR_AWARD` VALUES (1,1,1,2020,'Best Actor for portraying Tony Stark/Iron Man'),(1,9,1,2022,'Best Supporting Actor for Doctor Strange'),(1,22,2,2024,'Best Actor for Paul Atreides in Dune: Part Two'),(1,26,41,2021,'Oscar Best Actress for Nomadland'),(1,29,42,2022,'Oscar Best Supporting Actor for CODA'),(1,35,49,2017,'Oscar Best Supporting Actor for Moonlight'),(1,35,45,2019,'Oscar Best Supporting Actor for Green Book'),(2,2,1,2022,'Best Supporting Actress for Black Widow'),(2,21,4,2024,'Best Actress in Comedy for Barbie'),(2,29,42,2022,'Golden Globe Best Supporting Actor'),(2,35,45,2019,'Golden Globe Best Supporting Actor'),(2,41,48,2022,'Golden Globe Best Actress – Motion Picture Musical or Comedy for Rachel Zegler'),(3,26,41,2021,'BAFTA Best Actress in a Leading Role'),(3,29,42,2022,'BAFTA Best Supporting Actor'),(3,35,45,2019,'BAFTA Best Supporting Actor'),(4,15,7,2023,'Outstanding Performance for Black Panther: Wakanda Forever'),(4,19,10,2023,'Outstanding Performance by a Female Actor for Everything Everywhere All at Once'),(4,26,41,2021,'SAG Outstanding Performance by a Female Actor in a Leading Role'),(4,30,43,2020,'SAG Outstanding Performance by a Cast in a Motion Picture'),(4,31,43,2020,'SAG Outstanding Performance by a Cast in a Motion Picture'),(5,29,42,2022,'Critics Choice Best Supporting Actor'),(5,35,45,2019,'Critics Choice Best Supporting Actor'),(5,36,46,2023,'Critics Choice Best Young Performer nomination'),(6,20,4,2024,'Peoples Choice for Ken in Barbie'),(7,17,3,2022,'Best Comedic Performance for Deadpool'),(9,5,1,2020,'Best Fantasy Actor for Thor');
/*!40000 ALTER TABLE `ACTOR_AWARD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ADMIN`
--

DROP TABLE IF EXISTS `ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADMIN` (
  `ADMIN_ID` int NOT NULL AUTO_INCREMENT,
  `PERSON_ID` int NOT NULL,
  `ADMIN_TYPE` varchar(50) NOT NULL,
  PRIMARY KEY (`ADMIN_ID`),
  KEY `FK_ADMIN_PERSON_ID` (`PERSON_ID`),
  CONSTRAINT `FK_ADMIN_PERSON_ID` FOREIGN KEY (`PERSON_ID`) REFERENCES `PERSON` (`PERSON_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADMIN`
--

LOCK TABLES `ADMIN` WRITE;
/*!40000 ALTER TABLE `ADMIN` DISABLE KEYS */;
INSERT INTO `ADMIN` VALUES (1,1,'Super'),(2,2,'Content'),(3,3,'Support'),(4,4,'Marketing'),(5,120,'Content'),(6,121,'Support'),(7,122,'Marketing');
/*!40000 ALTER TABLE `ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AGE_RESTRICTION`
--

DROP TABLE IF EXISTS `AGE_RESTRICTION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AGE_RESTRICTION` (
  `AGE_RESTRICTION_ID` int NOT NULL AUTO_INCREMENT,
  `AGE_RESTRICTION_NAME` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`AGE_RESTRICTION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AGE_RESTRICTION`
--

LOCK TABLES `AGE_RESTRICTION` WRITE;
/*!40000 ALTER TABLE `AGE_RESTRICTION` DISABLE KEYS */;
INSERT INTO `AGE_RESTRICTION` VALUES (1,'G'),(2,'PG'),(3,'PG-13'),(4,'R'),(5,'NC-17'),(6,'TV-MA');
/*!40000 ALTER TABLE `AGE_RESTRICTION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AVAILABLE_COUNTRIES`
--

DROP TABLE IF EXISTS `AVAILABLE_COUNTRIES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AVAILABLE_COUNTRIES` (
  `SHOW_ID` int NOT NULL,
  `COUNTRY_ID` varchar(3) NOT NULL,
  PRIMARY KEY (`SHOW_ID`,`COUNTRY_ID`),
  KEY `FK_AVAILABLE_COUNTRIES_COUNTRY_ID` (`COUNTRY_ID`),
  CONSTRAINT `FK_AVAILABLE_COUNTRIES_COUNTRY_ID` FOREIGN KEY (`COUNTRY_ID`) REFERENCES `COUNTRY` (`COUNTRY_ID`),
  CONSTRAINT `FK_AVAILABLE_COUNTRIES_SHOW_ID` FOREIGN KEY (`SHOW_ID`) REFERENCES `SHOWS` (`SHOW_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AVAILABLE_COUNTRIES`
--

LOCK TABLES `AVAILABLE_COUNTRIES` WRITE;
/*!40000 ALTER TABLE `AVAILABLE_COUNTRIES` DISABLE KEYS */;
INSERT INTO `AVAILABLE_COUNTRIES` VALUES (1,'AUS'),(2,'AUS'),(3,'AUS'),(4,'AUS'),(5,'AUS'),(6,'AUS'),(7,'AUS'),(8,'AUS'),(9,'AUS'),(10,'AUS'),(1,'BRA'),(4,'BRA'),(5,'BRA'),(7,'BRA'),(1,'CAN'),(2,'CAN'),(3,'CAN'),(4,'CAN'),(5,'CAN'),(6,'CAN'),(7,'CAN'),(8,'CAN'),(9,'CAN'),(10,'CAN'),(1,'FRA'),(2,'FRA'),(4,'FRA'),(6,'FRA'),(9,'FRA'),(1,'GER'),(2,'GER'),(4,'GER'),(6,'GER'),(9,'GER'),(1,'IND'),(4,'IND'),(5,'IND'),(7,'IND'),(1,'JPN'),(4,'JPN'),(5,'JPN'),(1,'KOR'),(4,'KOR'),(5,'KOR'),(1,'UK'),(2,'UK'),(3,'UK'),(4,'UK'),(5,'UK'),(6,'UK'),(7,'UK'),(8,'UK'),(9,'UK'),(10,'UK'),(1,'USA'),(2,'USA'),(3,'USA'),(4,'USA'),(5,'USA'),(6,'USA'),(7,'USA'),(8,'USA'),(9,'USA'),(10,'USA');
/*!40000 ALTER TABLE `AVAILABLE_COUNTRIES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AVAILABLE_LANGUAGE`
--

DROP TABLE IF EXISTS `AVAILABLE_LANGUAGE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AVAILABLE_LANGUAGE` (
  `SHOW_ID` int NOT NULL,
  `LANGUAGE_ID` int NOT NULL,
  PRIMARY KEY (`SHOW_ID`,`LANGUAGE_ID`),
  KEY `FK_AVAILABLE_LANGUAGE_LANGUAGE_ID` (`LANGUAGE_ID`),
  CONSTRAINT `FK_AVAILABLE_LANGUAGE_LANGUAGE_ID` FOREIGN KEY (`LANGUAGE_ID`) REFERENCES `LANGUAGE` (`LANGUAGE_ID`),
  CONSTRAINT `FK_AVAILABLE_LANGUAGE_SHOW_ID` FOREIGN KEY (`SHOW_ID`) REFERENCES `SHOWS` (`SHOW_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AVAILABLE_LANGUAGE`
--

LOCK TABLES `AVAILABLE_LANGUAGE` WRITE;
/*!40000 ALTER TABLE `AVAILABLE_LANGUAGE` DISABLE KEYS */;
INSERT INTO `AVAILABLE_LANGUAGE` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(1,2),(2,2),(3,2),(4,2),(5,2),(7,2),(9,2),(1,3),(2,3),(4,3),(6,3),(9,3),(1,4),(2,4),(4,4),(6,4),(9,4),(1,5),(4,5),(5,5),(4,6),(5,6),(1,7),(5,7),(7,7),(4,8),(7,8),(10,9);
/*!40000 ALTER TABLE `AVAILABLE_LANGUAGE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AWARD`
--

DROP TABLE IF EXISTS `AWARD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AWARD` (
  `AWARD_ID` int NOT NULL AUTO_INCREMENT,
  `AWARD_NAME` varchar(50) DEFAULT NULL,
  `AWARDING_BODY` varchar(50) DEFAULT NULL,
  `IMG` varchar(100) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`AWARD_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AWARD`
--

LOCK TABLES `AWARD` WRITE;
/*!40000 ALTER TABLE `AWARD` DISABLE KEYS */;
INSERT INTO `AWARD` VALUES (1,'Oscar','Academy of Motion Picture Arts and Sciences','oscar.jpg','The Academy Awards (also known as Oscars) are a set of awards given annually for excellence of cinematic achievements by the Academy of Motion Picture Arts and Sciences (AMPAS). The first ceremony was held on May 16, 1929, honoring films released between August 1927 and July 1928.'),(2,'Golden Globe','Hollywood Foreign Press Association','goldenglobe.jpg','The Golden Globe Awards are accolades bestowed by the Hollywood Foreign Press Association (HFPA), recognizing excellence in film and television, both domestic and foreign. The first Golden Globe ceremony was held in January 1944, honoring the best achievements in 1943 filmmaking.'),(3,'BAFTA','British Academy of Film and Television Arts','bafta.jpg','The British Academy Film Awards, known as the BAFTAs, are presented annually by the British Academy of Film and Television Arts. Founded in 1947, BAFTA supports, develops and promotes the art forms of the moving image, hosting award ceremonies for film, television and games.'),(4,'Screen Actors Guild Award','Screen Actors Guild','sag.jpg','The Screen Actors Guild Awards are presented by the Screen Actors Guild‑American Federation of Television and Radio Artists (SAG‑AFTRA) to recognize outstanding performances in film and prime time television.'),(5,'Critics Choice Award','Critics Choice Association','criticschoice.jpg','The Critics\' Choice Awards are bestowed annually by the Critics Choice Association to recognize achievements in film, television, documentaries, and now, children’s media and animation.'),(6,'Peoples Choice Award','Peoples Choice','peopleschoice.jpg','The People\'s Choice Awards are an American awards show recognizing the people\'s favorites in film, television, music, and popular culture, voted on by the general public.'),(7,'MTV Movie Award','MTV','mtv_movie_award.jpg','The MTV Movie & TV Awards are a film and television awards show presented by MTV to honor outstanding achievements in both film and television.'),(8,'Teen Choice Award','Fox Broadcasting Company','teenchoice.jpg','The Teen Choice Awards are an annual awards show that airs on Fox, honoring achievements in music, film, television, sports, fashion and more, as voted on by viewers aged 13 to 19.'),(9,'Saturn Award','Academy of Science Fiction Fantasy Horror Films','saturn.jpg','The Saturn Awards are presented by the Academy of Science Fiction, Fantasy and Horror Films to honor the best in science fiction, fantasy, and horror in film, television and home media.');
/*!40000 ALTER TABLE `AWARD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CARD`
--

DROP TABLE IF EXISTS `CARD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CARD` (
  `METHOD_ID` int NOT NULL,
  `TRANSACTION_ID` int NOT NULL,
  `CARD_ID` varchar(20) DEFAULT NULL,
  `CARD_VCC` varchar(20) DEFAULT NULL,
  `EXPIRY_DATE` date DEFAULT NULL,
  `CARD_HOLDER_NAME` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`TRANSACTION_ID`),
  KEY `FK_CARD_METHOD_ID` (`METHOD_ID`),
  CONSTRAINT `FK_CARD_METHOD_ID` FOREIGN KEY (`METHOD_ID`) REFERENCES `METHOD` (`METHOD_ID`),
  CONSTRAINT `FK_CARD_TRANSACTION_ID` FOREIGN KEY (`TRANSACTION_ID`) REFERENCES `TRANSACTION` (`TRANSACTION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CARD`
--

LOCK TABLES `CARD` WRITE;
/*!40000 ALTER TABLE `CARD` DISABLE KEYS */;
/*!40000 ALTER TABLE `CARD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CATEGORY`
--

DROP TABLE IF EXISTS `CATEGORY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CATEGORY` (
  `CATEGORY_ID` int NOT NULL AUTO_INCREMENT,
  `CATEGORY_NAME` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CATEGORY`
--

LOCK TABLES `CATEGORY` WRITE;
/*!40000 ALTER TABLE `CATEGORY` DISABLE KEYS */;
INSERT INTO `CATEGORY` VALUES (1,'Movie'),(2,'Series'),(9,'Documentary');
/*!40000 ALTER TABLE `CATEGORY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COMMENT`
--

DROP TABLE IF EXISTS `COMMENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COMMENT` (
  `COMMENT_ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int DEFAULT NULL,
  `SHOW_EPISODE_ID` int DEFAULT NULL,
  `PARENT_ID` int DEFAULT NULL,
  `TIME` datetime DEFAULT NULL,
  `TEXT` varchar(500) DEFAULT NULL,
  `IMG_LINK` varchar(100) DEFAULT NULL,
  `LIKE_COUNT` int DEFAULT NULL,
  `DISLIKE_COUNT` int DEFAULT NULL,
  `DELETED` int DEFAULT NULL,
  `EDITED` int DEFAULT NULL,
  `PINNED` int DEFAULT NULL,
  PRIMARY KEY (`COMMENT_ID`),
  KEY `FK_COMMENT_SHOW_EPISODE_ID` (`SHOW_EPISODE_ID`),
  KEY `FK_COMMENT_USER_ID` (`USER_ID`),
  KEY `FK_COMMENT_PARENT_COMMENT_ID` (`PARENT_ID`),
  CONSTRAINT `FK_COMMENT_PARENT_COMMENT_ID` FOREIGN KEY (`PARENT_ID`) REFERENCES `COMMENT` (`COMMENT_ID`),
  CONSTRAINT `FK_COMMENT_SHOW_EPISODE_ID` FOREIGN KEY (`SHOW_EPISODE_ID`) REFERENCES `SHOW_EPISODE` (`SHOW_EPISODE_ID`),
  CONSTRAINT `FK_COMMENT_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMMENT`
--

LOCK TABLES `COMMENT` WRITE;
/*!40000 ALTER TABLE `COMMENT` DISABLE KEYS */;
INSERT INTO `COMMENT` VALUES (1,1,1,NULL,'2024-01-15 22:00:00','Amazing conclusion to the MCU saga! The emotional depth was incredible.',NULL,0,0,1,0,0),(2,2,4,NULL,'2024-02-14 20:30:00','Barbie was such a fun and colorful movie. Margot Robbie was perfect!',NULL,0,0,0,0,0),(3,3,3,NULL,'2024-01-25 23:15:00','Deadpool and Wolverine together? This is the crossover we needed!',NULL,1,0,0,0,1),(4,4,8,NULL,'2024-02-25 22:45:00','Nope was genuinely terrifying. Jordan Peele knows how to build suspense.',NULL,0,0,0,0,0),(5,5,1,1,'2024-02-05 21:30:00','I agree! The sacrifice scenes had me in tears.',NULL,0,1,0,0,0),(6,1,5,NULL,'2024-02-10 21:00:00','Spider-Man multiverse was mind-blowing. All three Spider-Men together!',NULL,2,0,0,0,0),(7,6,4,2,'2024-02-12 20:00:00','The production design was incredible. Every scene was Instagram-worthy!',NULL,0,0,0,0,0),(8,7,3,NULL,'2024-01-18 22:30:00','Ryan Reynolds never disappoints. The humor was on point as always.',NULL,0,0,0,0,0),(9,8,8,NULL,'2024-02-08 21:45:00','The cinematography in Nope was stunning. Every shot was perfect.',NULL,0,0,0,0,0),(10,9,9,NULL,'2024-02-15 20:15:00','Dune has such rich world-building. Denis Villeneuve is a master.',NULL,0,0,0,0,0),(11,10,1,NULL,'2024-02-18 21:15:00','This movie will be remembered as one of the greatest superhero films ever.',NULL,1,0,0,0,0),(12,1,6,NULL,'2024-01-16 10:30:00','Oppenheimer was a masterpiece. Cillian Murphy deserved that Oscar.',NULL,1,0,0,0,0),(13,2,10,NULL,'2024-03-01 22:00:00','Everything Everywhere All at Once blew my mind. So creative and emotional.',NULL,0,0,0,0,0),(14,4,7,NULL,'2024-01-30 23:00:00','Black Panther 2 was a beautiful tribute. Chadwick would be proud.',NULL,0,0,0,0,0),(15,3,6,NULL,'2024-02-20 21:00:00','The atomic bomb scenes were intense. Historical accuracy was impressive.',NULL,1,0,0,0,0),(16,1,11,NULL,'2025-06-26 21:00:00','Stranger Things is so nostalgic and thrilling!',NULL,0,0,0,0,1),(17,2,12,NULL,'2025-06-26 21:10:00','Eleven is such a unique character. Love it!',NULL,1,0,0,0,0),(18,3,13,NULL,'2025-06-26 22:00:00','This is the way.',NULL,0,0,0,0,0),(19,4,14,NULL,'2025-06-26 22:10:00','Baby Yoda stole the show!',NULL,0,0,0,0,1),(20,5,15,NULL,'2025-06-26 22:30:00','This show never gets old.',NULL,1,0,0,0,0),(21,6,16,NULL,'2025-06-26 22:35:00','Diversity Day is hilarious!',NULL,0,0,0,0,0),(22,7,17,NULL,'2025-06-26 23:00:00','Jake and Boyle are a dream team.',NULL,0,0,0,0,0),(23,8,18,NULL,'2025-06-26 23:05:00','Captain Holt\'s expressions are gold.',NULL,0,0,0,0,1),(24,9,19,NULL,'2025-06-26 23:30:00','Say my name.',NULL,0,0,0,0,1),(25,10,20,NULL,'2025-06-26 23:40:00','The suspense is insane!',NULL,0,0,0,0,0),(26,1,21,NULL,'2025-06-27 00:10:00','Feels like watching real history unfold.',NULL,0,0,0,0,0),(27,2,22,NULL,'2025-06-27 00:20:00','Impeccable production and acting.',NULL,0,0,0,0,0),(28,3,23,NULL,'2025-06-27 00:40:00','By order of the Peaky Blinders!',NULL,0,0,0,0,1),(29,4,24,NULL,'2025-06-27 00:50:00','Cillian Murphy is a beast.',NULL,0,0,0,0,0),(30,5,25,NULL,'2025-06-27 01:10:00','WandaVision is a creative masterpiece.',NULL,0,0,0,0,1),(31,6,26,NULL,'2025-06-27 01:20:00','The sitcom transitions are genius.',NULL,0,0,0,0,0),(32,7,27,NULL,'2025-06-27 01:40:00','Dark, twisted, and brilliant.',NULL,0,0,0,0,0),(33,8,28,NULL,'2025-06-27 01:45:00','Superheroes with real problems!',NULL,0,0,0,0,0),(34,9,29,NULL,'2025-06-27 02:00:00','Toss a coin to your witcher!',NULL,0,0,0,0,1),(35,10,30,NULL,'2025-06-27 02:10:00','Amazing visuals and storytelling.',NULL,0,0,0,0,0),(36,1,31,NULL,'2025-06-28 21:56:40','Season 2 starts with a bang!',NULL,0,0,0,0,0),(37,2,33,NULL,'2025-06-28 21:56:40','Can’t believe what happened at the mall!',NULL,0,0,0,0,1),(38,3,35,NULL,'2025-06-28 21:56:40','Tuco is terrifying. ?',NULL,0,0,0,0,0),(39,4,37,NULL,'2025-06-28 21:56:40','Walter\'s transformation is wild.',NULL,0,0,0,0,0),(40,14,16,NULL,'2025-07-08 09:48:02','Gay as shit',NULL,0,0,0,0,0),(41,14,23,NULL,'2025-07-08 15:21:20','alkjdvnaekxmvnpwqv',NULL,0,0,0,0,0),(42,14,1,11,'2025-07-08 16:36:32','frfr',NULL,1,0,0,0,0),(43,14,1,11,'2025-07-08 16:42:01','frfr?',NULL,1,0,0,0,0),(44,14,1,11,'2025-07-08 16:43:52','yep',NULL,0,0,0,0,0),(45,14,2,NULL,'2025-07-09 11:29:01','I am ARnab',NULL,1,0,0,0,0),(46,14,15,NULL,'2025-07-09 13:04:48','sth sth',NULL,1,0,1,0,0),(47,14,15,NULL,'2025-07-09 13:19:15','sth',NULL,0,0,1,0,0),(48,14,15,NULL,'2025-07-09 13:20:19','comment',NULL,0,0,1,0,0),(49,14,15,NULL,'2025-07-09 13:29:41','hggfc',NULL,1,0,0,0,0),(50,14,1,NULL,'2025-07-09 14:48:24','Why are you so dumb?',NULL,0,1,0,0,0),(51,14,1,NULL,'2025-07-09 14:57:20','Heyfdbdbd',NULL,1,0,0,1,0),(56,14,15,46,'2025-07-10 12:54:56','cvabaeb',NULL,0,1,0,0,0),(57,14,15,47,'2025-07-10 12:55:22','sdvsvvd',NULL,0,0,0,0,0),(58,14,15,48,'2025-07-10 12:55:34','svsdvsv',NULL,0,0,0,0,0),(59,14,6,12,'2025-07-10 14:13:33','yah...csvasdvsvdav',NULL,1,0,0,1,0),(81,12,6,NULL,'2025-07-10 16:51:35','japanese people watching this shit:','/images/comment_uploads/1752144695946-194639595.jpg',1,0,0,0,0),(88,14,6,NULL,'2025-07-10 23:25:51','gay',NULL,0,0,0,1,0),(91,14,6,81,'2025-07-13 13:31:14','peace',NULL,1,0,0,0,0),(97,14,6,NULL,'2025-07-13 23:03:47','',NULL,0,0,1,0,0),(100,14,6,81,'2025-07-16 11:36:52','hey',NULL,0,0,0,0,0),(102,12,6,97,'2025-07-18 11:49:46','no u',NULL,0,0,1,0,0),(103,12,72,NULL,'2025-07-18 11:53:00','well well well',NULL,0,0,0,0,0),(104,14,72,NULL,'2025-07-18 11:53:22','well well well',NULL,1,0,0,0,0),(105,12,72,104,'2025-07-18 11:54:11','yup',NULL,0,0,0,0,0),(106,14,72,103,'2025-07-18 11:58:52','sdvsv\ns',NULL,0,0,0,1,0),(107,12,6,97,'2025-07-23 22:01:44','sdvavs',NULL,0,0,1,0,0),(108,12,6,NULL,'2025-07-23 22:01:48','svvsdvsd',NULL,0,0,0,0,0),(109,12,6,108,'2025-07-23 22:01:50','sdvsvs',NULL,0,0,0,0,0),(110,12,6,108,'2025-07-23 22:01:53','sdvsdvv',NULL,0,0,0,0,0),(114,36,5,NULL,'2025-07-29 04:54:26','One piece better ngl',NULL,0,1,0,0,0),(115,38,1,NULL,'2025-07-29 16:23:37','kothinnnn',NULL,0,0,0,0,0);
/*!40000 ALTER TABLE `COMMENT` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `after_comment_insert_reply_notification` AFTER INSERT ON `COMMENT` FOR EACH ROW BEGIN
    DECLARE parent_user_id INT;
    DECLARE new_notif_id BIGINT;
    DECLARE show_id INT;
    DECLARE show_title VARCHAR(255);
    DECLARE episode_title VARCHAR(255);
    DECLARE season_number INT;
    DECLARE category_id INT;
    DECLARE notification_message VARCHAR(255);
    DECLARE show_title_with_season VARCHAR(255);

    IF NEW.PARENT_ID IS NOT NULL THEN
        SELECT USER_ID INTO parent_user_id
        FROM COMMENT
        WHERE COMMENT_ID = NEW.PARENT_ID;

        IF parent_user_id != NEW.USER_ID AND parent_user_id IS NOT NULL THEN
            SELECT s.SHOW_ID, s.TITLE, s.SEASON, s.CATEGORY_ID, se.SHOW_EPISODE_TITLE
            INTO show_id, show_title, season_number, category_id, episode_title
            FROM SHOW_EPISODE se
            JOIN SHOWS s ON se.SHOW_ID = s.SHOW_ID
            WHERE se.SHOW_EPISODE_ID = NEW.SHOW_EPISODE_ID;

            IF category_id = 1 THEN
                SET show_title_with_season = show_title;
            ELSE
                SET show_title_with_season = CONCAT(show_title, ' Season ', COALESCE(season_number, 1));
            END IF;

            SET notification_message = CONCAT('Someone replied to your comment on ', show_title_with_season);

            INSERT INTO NOTIFICATIONS (MESSAGE, TYPE, DATA)
            VALUES (
                notification_message,
                'comment_reply',
                JSON_OBJECT(
                    'movie_id', show_id,
                    'comment_id', NEW.PARENT_ID,
                    'reply_id', NEW.COMMENT_ID,
                    'show_title', show_title_with_season,
                    'episode_title', episode_title,
                    'show_episode_id', NEW.SHOW_EPISODE_ID
                )
            );

            SET new_notif_id = LAST_INSERT_ID();

            INSERT INTO USER_NOTIFICATIONS (USER_ID, NOTIF_ID, IS_READ)
            VALUES (CAST(parent_user_id AS UNSIGNED), new_notif_id, FALSE);
        END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `tr_comment_reply_notification` AFTER INSERT ON `COMMENT` FOR EACH ROW BEGIN
    DECLARE parent_user_id INT;
    DECLARE new_notif_id BIGINT;
    DECLARE show_id INT;
    DECLARE show_title VARCHAR(255);
    DECLARE episode_title VARCHAR(255);
    DECLARE season_number INT;
    DECLARE category_id INT;
    DECLARE notification_message VARCHAR(255);
    DECLARE show_title_with_season VARCHAR(255);

    -- Only proceed if this is a reply (has a parent comment)
    IF NEW.PARENT_ID IS NOT NULL THEN

        -- Get the user ID of the parent comment
        SELECT USER_ID INTO parent_user_id
        FROM COMMENT
        WHERE COMMENT_ID = NEW.PARENT_ID;

        -- Only send notification if the parent comment user is different from the current user
        -- (don't notify users when they reply to their own comments)
        IF parent_user_id IS NOT NULL AND parent_user_id != NEW.USER_ID THEN

            -- Get show and episode information for the notification
            SELECT s.SHOW_ID, s.TITLE, s.SEASON, s.CATEGORY_ID, se.SHOW_EPISODE_TITLE
            INTO show_id, show_title, season_number, category_id, episode_title
            FROM SHOW_EPISODE se
            JOIN SHOWS s ON se.SHOW_ID = s.SHOW_ID
            WHERE se.SHOW_EPISODE_ID = NEW.SHOW_EPISODE_ID;

            -- Create show title with season for TV shows
            IF category_id = 1 THEN
                SET show_title_with_season = show_title;
            ELSE
                SET show_title_with_season = CONCAT(show_title, ' Season ', COALESCE(season_number, 1));
            END IF;

            -- Create the notification message
            SET notification_message = CONCAT('Someone replied to your comment on ', show_title_with_season);

            -- Insert the notification into NOTIFICATIONS table
            INSERT INTO NOTIFICATIONS (MESSAGE, TYPE, DATA)
            VALUES (
                notification_message,
                'comment_reply',
                JSON_OBJECT(
                    'movie_id', show_id,
                    'comment_id', NEW.PARENT_ID,
                    'reply_id', NEW.COMMENT_ID,
                    'show_title', show_title_with_season,
                    'episode_title', episode_title,
                    'show_episode_id', NEW.SHOW_EPISODE_ID
                )
            );

            -- Get the ID of the newly created notification
            SET new_notif_id = LAST_INSERT_ID();

            -- Insert notification for the parent comment user
            INSERT INTO USER_NOTIFICATIONS (USER_ID, NOTIF_ID, IS_READ)
            VALUES (parent_user_id, new_notif_id, FALSE);

        END IF;

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `COMMENT_INTERACTIONS`
--

DROP TABLE IF EXISTS `COMMENT_INTERACTIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COMMENT_INTERACTIONS` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `COMMENT_ID` int NOT NULL,
  `INTERACTION_TYPE` enum('like','dislike') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `unique_user_comment` (`USER_ID`,`COMMENT_ID`),
  KEY `idx_comment_interactions_user_id` (`USER_ID`),
  KEY `idx_comment_interactions_comment_id` (`COMMENT_ID`),
  CONSTRAINT `COMMENT_INTERACTIONS_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE,
  CONSTRAINT `COMMENT_INTERACTIONS_ibfk_2` FOREIGN KEY (`COMMENT_ID`) REFERENCES `COMMENT` (`COMMENT_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMMENT_INTERACTIONS`
--

LOCK TABLES `COMMENT_INTERACTIONS` WRITE;
/*!40000 ALTER TABLE `COMMENT_INTERACTIONS` DISABLE KEYS */;
INSERT INTO `COMMENT_INTERACTIONS` VALUES (1,14,20,'like','2025-07-09 04:53:32','2025-07-09 04:53:32'),(12,14,45,'like','2025-07-09 05:29:04','2025-07-27 17:02:45'),(13,14,46,'like','2025-07-09 07:04:59','2025-07-10 06:55:05'),(16,14,49,'like','2025-07-09 07:29:42','2025-07-09 07:29:42'),(17,14,3,'like','2025-07-09 07:54:43','2025-07-09 07:54:43'),(28,14,17,'like','2025-07-09 09:19:32','2025-07-09 09:19:32'),(30,14,51,'like','2025-07-09 09:31:20','2025-07-09 09:31:22'),(31,14,50,'dislike','2025-07-09 09:31:23','2025-07-28 18:14:51'),(34,14,56,'dislike','2025-07-10 06:54:58','2025-07-10 06:54:59'),(41,14,81,'like','2025-07-10 15:37:05','2025-07-10 15:37:05'),(43,14,15,'like','2025-07-13 17:01:56','2025-07-13 17:01:58'),(44,14,12,'like','2025-07-16 04:41:54','2025-07-16 04:41:54'),(45,14,59,'like','2025-07-16 04:41:56','2025-07-16 04:41:56'),(46,14,91,'like','2025-07-16 05:36:43','2025-07-16 05:36:43'),(48,14,104,'like','2025-07-23 10:44:50','2025-07-23 10:44:50'),(50,14,6,'like','2025-07-28 18:08:54','2025-07-28 18:08:54'),(51,14,5,'dislike','2025-07-28 18:15:09','2025-07-28 18:15:09'),(52,36,114,'dislike','2025-07-29 04:54:34','2025-07-29 04:54:34'),(53,36,6,'like','2025-07-29 05:01:08','2025-07-29 05:01:08');
/*!40000 ALTER TABLE `COMMENT_INTERACTIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CONTENT_ADMIN`
--

DROP TABLE IF EXISTS `CONTENT_ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONTENT_ADMIN` (
  `ADMIN_ID` int NOT NULL,
  PRIMARY KEY (`ADMIN_ID`),
  CONSTRAINT `FK_CONTENT_ADMIN_ID` FOREIGN KEY (`ADMIN_ID`) REFERENCES `ADMIN` (`ADMIN_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CONTENT_ADMIN`
--

LOCK TABLES `CONTENT_ADMIN` WRITE;
/*!40000 ALTER TABLE `CONTENT_ADMIN` DISABLE KEYS */;
INSERT INTO `CONTENT_ADMIN` VALUES (2),(5);
/*!40000 ALTER TABLE `CONTENT_ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CONTRACT_RENEWAL_REQUEST`
--

DROP TABLE IF EXISTS `CONTRACT_RENEWAL_REQUEST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONTRACT_RENEWAL_REQUEST` (
  `REQUEST_ID` int NOT NULL AUTO_INCREMENT,
  `PUBLISHER_ID` int NOT NULL,
  `REQUEST_DATE` date NOT NULL,
  `STATUS` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `RESPONSE_DATE` date DEFAULT NULL,
  `RENEWAL_YEARS` int DEFAULT NULL,
  `NEW_MIN_GUARANTEE` decimal(10,2) DEFAULT NULL,
  `NEW_ROYALTY` decimal(10,2) DEFAULT NULL,
  `REQUESTED_BY` enum('ADMIN','PUBLISHER') NOT NULL,
  `IS_SEEN_ADMIN` int DEFAULT NULL,
  `IS_SEEN_PUB` int DEFAULT NULL,
  PRIMARY KEY (`REQUEST_ID`),
  KEY `PUBLISHER_ID` (`PUBLISHER_ID`),
  CONSTRAINT `CONTRACT_RENEWAL_REQUEST_ibfk_1` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `PUBLISHER` (`PUBLISHER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CONTRACT_RENEWAL_REQUEST`
--

LOCK TABLES `CONTRACT_RENEWAL_REQUEST` WRITE;
/*!40000 ALTER TABLE `CONTRACT_RENEWAL_REQUEST` DISABLE KEYS */;
INSERT INTO `CONTRACT_RENEWAL_REQUEST` VALUES (3,1,'2025-07-25','REJECTED','2025-07-25',5,19.99,0.05,'ADMIN',1,1),(4,1,'2025-07-25','REJECTED','2025-07-25',5,25.99,0.05,'ADMIN',1,0),(5,1,'2025-07-25','REJECTED','2025-07-25',365,29.99,0.05,'PUBLISHER',1,0),(7,1,'2025-07-25','REJECTED','2025-07-25',365,19.99,0.05,'PUBLISHER',0,0),(8,1,'2025-07-25','REJECTED','2025-07-25',365,19.99,0.05,'PUBLISHER',0,0),(9,1,'2025-07-25','APPROVED','2025-07-25',365,29.99,0.05,'PUBLISHER',0,0),(10,1,'2025-07-25','APPROVED','2025-07-25',5,29.99,0.05,'PUBLISHER',0,0),(11,1,'2025-07-25','APPROVED','2025-07-25',5,29.99,0.05,'PUBLISHER',0,0),(12,1,'2025-07-25','APPROVED','2025-07-25',5,34.99,0.05,'ADMIN',1,0),(13,1,'2025-07-28','APPROVED','2025-07-28',1,35.99,0.05,'PUBLISHER',1,0);
/*!40000 ALTER TABLE `CONTRACT_RENEWAL_REQUEST` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COUNTRY`
--

DROP TABLE IF EXISTS `COUNTRY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COUNTRY` (
  `COUNTRY_ID` varchar(3) NOT NULL,
  `COUNTRY_NAME` varchar(50) NOT NULL,
  PRIMARY KEY (`COUNTRY_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COUNTRY`
--

LOCK TABLES `COUNTRY` WRITE;
/*!40000 ALTER TABLE `COUNTRY` DISABLE KEYS */;
INSERT INTO `COUNTRY` VALUES ('AUS','Australia'),('BD','BANGLADESH'),('BRA','Brazil'),('CAN','Canada'),('FRA','France'),('GER','Germany'),('IND','India'),('JPN','Japan'),('KOR','South Korea'),('UK','United Kingdom'),('USA','United States');
/*!40000 ALTER TABLE `COUNTRY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CUSTOMER_CARE_REQUEST`
--

DROP TABLE IF EXISTS `CUSTOMER_CARE_REQUEST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CUSTOMER_CARE_REQUEST` (
  `REQUEST_ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int NOT NULL,
  `SUBJECT` varchar(255) NOT NULL,
  `MESSAGE` text NOT NULL,
  `STATUS` enum('OPEN','REPLIED','CLOSED') DEFAULT 'OPEN',
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ADMIN_REPLY` text,
  `REPLIED_AT` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`REQUEST_ID`),
  KEY `USER_ID` (`USER_ID`),
  CONSTRAINT `CUSTOMER_CARE_REQUEST_ibfk_1` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CUSTOMER_CARE_REQUEST`
--

LOCK TABLES `CUSTOMER_CARE_REQUEST` WRITE;
/*!40000 ALTER TABLE `CUSTOMER_CARE_REQUEST` DISABLE KEYS */;
INSERT INTO `CUSTOMER_CARE_REQUEST` VALUES (1,12,'General Inquiry','dawg site, rating 0','CLOSED','2025-07-23 16:48:59','2025-07-23 17:05:17','nah','2025-07-23 17:05:12'),(2,12,'Technical Support','a','REPLIED','2025-07-23 17:08:01','2025-07-23 17:08:14','a','2025-07-23 17:08:14'),(3,12,'Bug Report','a','CLOSED','2025-07-23 17:38:14','2025-07-23 17:38:24',NULL,NULL),(4,14,'Technical Support','SDVAWVWBVED','REPLIED','2025-07-28 15:25:54','2025-07-28 15:26:05','NAH','2025-07-28 15:26:05'),(5,14,'Technical Support','sdvsvs','REPLIED','2025-07-28 16:09:00','2025-07-28 16:09:09','dsadadsa','2025-07-28 16:09:09'),(6,28,'Technical Support','password bhule gesi','REPLIED','2025-07-28 18:14:54','2025-07-28 18:17:03','Z12 ar bhulis na pls fazin','2025-07-28 18:17:03'),(7,28,'General Inquiry','Thanks my G','OPEN','2025-07-28 18:18:38','2025-07-28 18:18:38',NULL,NULL),(8,28,'Bug Report','Btw awards er chobi ashe na flicker kortese\n','REPLIED','2025-07-28 18:19:18','2025-07-28 19:03:25','korbo','2025-07-28 19:03:25'),(9,31,'General Inquiry','Osthir vai','REPLIED','2025-07-28 18:21:58','2025-07-28 19:03:18','Thanks man','2025-07-28 19:03:18'),(10,33,'Feature Request','I bought a subscription but can\'t see movies .plz return my money','REPLIED','2025-07-28 19:04:28','2025-07-28 19:05:11','1500 taka diye movie kintam coffee khaiya felsi\n','2025-07-28 19:05:11'),(11,34,'Feature Request','I want the access of this website \n','OPEN','2025-07-28 19:28:25','2025-07-28 19:28:25',NULL,NULL);
/*!40000 ALTER TABLE `CUSTOMER_CARE_REQUEST` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_admin_reply_notification` AFTER UPDATE ON `CUSTOMER_CARE_REQUEST` FOR EACH ROW BEGIN
  DECLARE last_notif_id BIGINT;

  -- Check if ADMIN_REPLY changed from NULL to NOT NULL
  IF NEW.ADMIN_REPLY IS NOT NULL AND OLD.ADMIN_REPLY IS NULL THEN

    -- Insert into NOTIFICATIONS table
    INSERT INTO NOTIFICATIONS (MESSAGE, TYPE, DATA)
    VALUES (
      CONCAT('Admin replied to your support request: ', NEW.SUBJECT),
      'admin_notice',
      JSON_OBJECT('request_id', NEW.REQUEST_ID)
    );

    -- Get the last inserted notification ID
    SET last_notif_id = LAST_INSERT_ID();

    -- Insert into USER_NOTIFICATIONS table
    INSERT INTO USER_NOTIFICATIONS (USER_ID, NOTIF_ID)
    VALUES (NEW.USER_ID, last_notif_id);

  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `DIRECTOR`
--

DROP TABLE IF EXISTS `DIRECTOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DIRECTOR` (
  `DIRECTOR_ID` int NOT NULL AUTO_INCREMENT,
  `DIRECTOR_FIRSTNAME` varchar(50) DEFAULT NULL,
  `DIRECTOR_LASTNAME` varchar(50) DEFAULT NULL,
  `BIOGRAPHY` varchar(500) DEFAULT NULL,
  `PICTURE` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`DIRECTOR_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DIRECTOR`
--

LOCK TABLES `DIRECTOR` WRITE;
/*!40000 ALTER TABLE `DIRECTOR` DISABLE KEYS */;
INSERT INTO `DIRECTOR` VALUES (1,'Christopher','Nolan','British-American director known for complex storytelling in films like Inception and Oppenheimer.','nolan.jpg'),(2,'Steven','Spielberg','Steven Spielberg is an American filmmaker widely regarded as one of the most influential directors in cinematic history. His works span numerous genres and include classics such as Jurassic Park, E.T., and West Side Story.','spielberg.jpg'),(3,'Martin','Scorsese','Martin Scorsese is an American filmmaker, producer, and actor considered one of the greatest directors in cinema history. His films include classics like Taxi Driver, Goodfellas, and The Departed.','scorsese.jpg'),(4,'Quentin','Tarantino','American director known for stylized violence and nonlinear narratives like Pulp Fiction.','tarantino.jpg'),(5,'Denis','Villeneuve','Canadian director celebrated for Dune, Blade Runner 2049, and Arrival.','denis.jpg'),(6,'Ryan','Coogler','American director of Black Panther and Creed, known for impactful storytelling.','coogler.jpg'),(7,'Greta','Gerwig','American director, actress, and screenwriter known for Lady Bird and Barbie.','greta.jpg'),(8,'Jordan','Peele','American filmmaker known for horror films like Get Out and Nope.','peele.jpg'),(9,'Chloe','Zhao','Chloé Zhao is a Chinese-born filmmaker known for her poetic, naturalistic filmmaking style. She gained widespread acclaim for her feature films, including Nomadland, which won the Academy Award for Best Picture and earned her the Oscar for Best Director.','zhao.jpg'),(10,'Patty','Jenkins','American director known for Wonder Woman and Monster.','jenkins.jpg'),(11,'James','Cameron','Canadian director behind blockbuster epics like Titanic and Avatar.','cameron.jpg'),(12,'Anthony','Russo','One of the Russo Brothers, co-director of Avengers: Endgame and Infinity War.','anthony_russo.jpg'),(13,'Joe','Russo','One of the Russo Brothers, co-director of Captain America and Avengers films.','joe_russo.jpg'),(14,'Jon','Favreau','American director and actor, created The Mandalorian and directed Iron Man.','favreau.jpg'),(15,'Taika','Waititi','New Zealand filmmaker known for Thor: Ragnarok and Jojo Rabbit.','taika.jpg'),(18,'Sian','Heder','Sian Heder is an American filmmaker and writer. She gained notable recognition for writing and directing the film CODA, which won several awards for its heartwarming portrayal of a hearing child in a deaf family.','sian_heder.jpg'),(19,'Bong','Joon-ho','Bong Joon-ho is a South Korean filmmaker celebrated for his genre-blending films that combine social commentary with dark humor and thrilling narratives. He won the Academy Award for Best Director for Parasite.','bong_joon-ho.jpg'),(20,'Guillermo','del Toro','Guillermo del Toro is a Mexican filmmaker, author, and actor known for his imaginative storytelling and use of fantastical elements. He received critical acclaim and multiple awards for directing The Shape of Water.','guillermo_del_toro.jpg'),(21,'Peter','Farrelly','Peter Farrelly is an American filmmaker, known for directing comedy films alongside his brother Bobby Farrelly. He directed Green Book, which won the Academy Award for Best Picture.','peter_farrelly.jpg'),(23,'Todd','Field','Todd Field is an American actor and filmmaker known for his thoughtful, character-driven films. He wrote and directed Tár, which explores the life of a renowned conductor facing personal and professional challenges.','todd_field.jpg'),(24,'Barry','Jenkins','Barry Jenkins is an American filmmaker best known for his film Moonlight, which won the Academy Award for Best Picture. His work often explores themes of identity, race, and personal struggle.','barry_jenkins.jpg'),(26,'Sam','Mendes','Sir Samuel Alexander Mendes CBE (born 1 August 1965) is a British film and stage director, producer, and screenwriter. In 2000, Mendes was appointed a CBE for his services to drama, and he was knighted in the 2020 New Years Honours List.','sam_mendes.jpg'),(27,'Jane','Campion','Dame Elizabeth Jane Campion DNZM (born 30 April 1954) is a New Zealand filmmaker. She is best known for writing and directing the critically acclaimed films The Piano (1993) and The Power of the Dog (2021), for which she has received two Academy Awards (including Best Director for the latter), two BAFTA Awards, and two Golden Globe Awards.','jane_campion.jpg'),(28,'Daniel','Kwan','Daniel Kwan (born February 10, 1988) and Daniel Scheinert (born June 7, 1987), known collectively as the Daniels, are an American filmmaking duo. They began their career as directors of music videos, including ones for \"Houdini\" (2012) by Foster the People and \"Turn Down for What\" (2013) by DJ Snake and Lil Jon, both of which earned them Grammy Award nominations.','daniel_kwan.jpg'),(29,'Daniel','Scheinert','Daniel Kwan (born February 10, 1988) and Daniel Scheinert (born June 7, 1987), known collectively as the Daniels, are an American filmmaking duo. They began their career as directors of music videos, including ones for \"Houdini\" (2012) by Foster the People and \"Turn Down for What\" (2013) by DJ Snake and Lil Jon, both of which earned them Grammy Award nominations.','daniel_scheinert.jpg'),(30,'Edward','Berger','Edward Berger (German: [ˈedvart ˈbɛʁɡɐ]; born 1970) is a Swiss and Austrian director and screenwriter. He is known for his work in Germany, where he was born and grew up, such as the German films Jack (2014), All My Loving (2019), and All Quiet on the Western Front (2022), as well as his English-language debut Conclave (2024). He also directed several television series including Deutschland 83 (2015) and Patrick Melrose (2018).','edward_berger.jpg'),(31,'Todd','Phillips','Todd Phillips is an American filmmaker known for The Hangover series and Joker (2019), which earned him Academy Award nominations.','Todd_Phillips.jpg'),(32,'Rupert','Goold','Rupert Goold is an English theatre director and artistic director of the Almeida Theatre, known for his work in the West End and with the Royal Shakespeare Company.','Rupert_Goold.jpg'),(33,'Jason','Woliner','Jason Woliner is an American director and writer, known for directing Borat Subsequent Moviefilm and his work on the sketch comedy show Human Giant.','Jason_Woliner.jpg'),(34,'George C.','Wolfe','George C. Wolfe is an American stage and screen director and playwright, known for directing Angels in America and serving as Artistic Director of The Public Theater.','George_C_Wolfe.jpg'),(35,'Aleem','Khan','Aleem Khan is a British film director and screenwriter, known for his film After Love (2020) which earned multiple awards.','Aleem_Khan.jpg'),(36,'Lee','Daniels','Lee Daniels is an American director and producer, known for Precious (2009) and The United States vs. Billie Holiday (2021).','Lee_Daniels.jpg'),(37,'Michael','Showalter','Michael Showalter is an American director and writer, known for The Big Sick (2017) and The Lovebirds (2020).','Michael_Showalter.jpg'),(38,'Reinaldo Marcus','Green','Reinaldo Marcus Green is an American director known for King Richard (2021), which received critical acclaim.','Reinaldo_Marcus_Green.jpg'),(39,'Aaron','Sorkin','Aaron Sorkin is an American screenwriter and director, known for The West Wing, The Social Network, and directorial debut Molly\'s Game.','Aaron_Sorkin.jpg'),(40,'Baz','Luhrmann','Baz Luhrmann is an Australian director known for his visually rich films like Moulin Rouge! and The Great Gatsby.','Baz_Luhrmann.jpg'),(41,'Martin','McDonagh','Martin McDonagh is an Irish-British playwright and director known for dark comedies like In Bruges and Three Billboards Outside Ebbing, Missouri.','Martin_McDonagh.jpg'),(42,'Yorgos','Lanthimos','Yorgos Lanthimos is a Greek filmmaker known for surreal films like The Lobster and The Favourite.','Yorgos_Lanthimos.jpg'),(43,'Alexander','Payne','Alexander Payne is an American director known for films like Sideways and The Descendants, winning two Academy Awards.','Alexander_Payne.jpg'),(45,'SVSV','DSV','XVSVS','20250302_185504-1753716077132.jpg');
/*!40000 ALTER TABLE `DIRECTOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DIRECTOR_AWARD`
--

DROP TABLE IF EXISTS `DIRECTOR_AWARD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DIRECTOR_AWARD` (
  `AWARD_ID` int NOT NULL,
  `DIRECTOR_ID` int NOT NULL,
  `SHOW_ID` int DEFAULT NULL,
  `YEAR` int NOT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`AWARD_ID`,`DIRECTOR_ID`,`YEAR`),
  KEY `FK_DIRECTOR_AWARD_DIRECTOR_ID` (`DIRECTOR_ID`),
  CONSTRAINT `FK_DIRECTOR_AWARD_AWARD_ID` FOREIGN KEY (`AWARD_ID`) REFERENCES `AWARD` (`AWARD_ID`),
  CONSTRAINT `FK_DIRECTOR_AWARD_DIRECTOR_ID` FOREIGN KEY (`DIRECTOR_ID`) REFERENCES `DIRECTOR` (`DIRECTOR_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DIRECTOR_AWARD`
--

LOCK TABLES `DIRECTOR_AWARD` WRITE;
/*!40000 ALTER TABLE `DIRECTOR_AWARD` DISABLE KEYS */;
INSERT INTO `DIRECTOR_AWARD` VALUES (1,1,6,2024,'Best Director for Oppenheimer'),(1,2,48,2022,'Golden Globe Best Director nomination for West Side Story'),(1,2,46,2023,'Oscar Best Director nomination for The Fabelmans'),(1,3,50,2007,'Oscar Best Director for The Departed'),(1,5,2,2024,'Best Director for Dune: Part Two'),(1,9,41,2021,'Oscar Best Director for Nomadland'),(1,11,10,2023,'Best Director for Everything Everywhere All at Once'),(1,18,42,2022,'Oscar Best Adapted Screenplay for CODA'),(1,19,43,2020,'Oscar Best Director for Parasite'),(1,20,44,2017,'Oscar Best Director for The Shape of Water'),(1,21,45,2019,'Oscar Best Original Screenplay nomination for Green Book'),(1,23,47,2023,'Oscar Best Director nomination for Tár'),(1,24,49,2017,'Oscar Best Director nomination for Moonlight'),(2,1,6,2024,'Best Director Motion Picture for Oppenheimer'),(2,3,50,2007,'Golden Globe Best Director for The Departed'),(2,6,7,2023,'Best Director for Black Panther: Wakanda Forever'),(2,7,4,2024,'Best Director for Barbie'),(2,9,41,2021,'Golden Globe Best Director for Nomadland'),(2,19,43,2020,'Golden Globe Best Director for Parasite'),(2,20,44,2017,'Golden Globe Best Director for The Shape of Water'),(2,21,45,2019,'Golden Globe Best Screenplay nomination for Green Book'),(3,3,50,2007,'BAFTA Best Director for The Departed'),(3,9,41,2021,'BAFTA Best Director for Nomadland'),(3,19,43,2020,'BAFTA Best Director for Parasite'),(3,20,44,2017,'BAFTA Best Director for The Shape of Water'),(4,12,1,2020,'Outstanding Performance by a Stunt Ensemble for Avengers: Endgame'),(4,13,1,2020,'Outstanding Performance by a Stunt Ensemble for Avengers: Endgame'),(9,5,2,2022,'Best Science Fiction Film for Dune'),(9,8,8,2023,'Best Science Fiction Film for Nope');
/*!40000 ALTER TABLE `DIRECTOR_AWARD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FAQ`
--

DROP TABLE IF EXISTS `FAQ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FAQ` (
  `FAQ_ID` int NOT NULL AUTO_INCREMENT,
  `QUESTION` text NOT NULL,
  `ANSWER` text NOT NULL,
  PRIMARY KEY (`FAQ_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FAQ`
--

LOCK TABLES `FAQ` WRITE;
/*!40000 ALTER TABLE `FAQ` DISABLE KEYS */;
INSERT INTO `FAQ` VALUES (1,'How do I change my password?','Go to Personal Details section, scroll down to \"Change Password\", enter your current password and new password, then click \"Save Changes\".'),(2,'How do I update my billing information?','Navigate to the \"Billing & Payment\" section on the left menu, update your card details and billing address, then save your changes.'),(3,'How do I customize my viewing preferences?','Go to the \"Personalization\" section where you can adjust theme settings, autoplay preferences, and subtitle defaults to enhance your viewing experience.'),(4,'How do I enable/disable notifications?','In the \"Personalization\" section, you can toggle email notifications and push notifications on or off according to your preferences.'),(5,'I forgot my password. What should I do?','Please contact our customer support team using the contact form below or call our support hotline. We will help you reset your password securely.'),(6,'How do I cancel my subscription?','To cancel your subscription, please contact our customer support team. We will process your cancellation request and confirm the details with you.'),(7,'Can I change my email address?','Yes, you can update your email address in the \"Personal Details\" section. Make sure to verify the new email address when prompted.'),(8,'How do I enable subtitles by default?','Go to \"Personalization\" → \"Playback\" section and toggle on \"Default Subtitles\". This will enable subtitles for all content by default.');
/*!40000 ALTER TABLE `FAQ` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FAV_LIST_SHOW`
--

DROP TABLE IF EXISTS `FAV_LIST_SHOW`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FAV_LIST_SHOW` (
  `USER_ID` int NOT NULL,
  `SHOW_ID` int NOT NULL,
  `ADD_DATE` date DEFAULT NULL,
  `WATCHED` int DEFAULT NULL,
  PRIMARY KEY (`USER_ID`,`SHOW_ID`),
  KEY `FK_FAV_LIST_SHOW_SHOW_ID` (`SHOW_ID`),
  CONSTRAINT `FK_FAV_LIST_SHOW_SHOW_ID` FOREIGN KEY (`SHOW_ID`) REFERENCES `SHOWS` (`SHOW_ID`),
  CONSTRAINT `FK_FAV_LIST_SHOW_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FAV_LIST_SHOW`
--

LOCK TABLES `FAV_LIST_SHOW` WRITE;
/*!40000 ALTER TABLE `FAV_LIST_SHOW` DISABLE KEYS */;
INSERT INTO `FAV_LIST_SHOW` VALUES (1,1,'2024-01-15',1),(1,5,'2024-02-10',1),(1,9,'2024-03-05',0),(2,2,'2024-01-20',0),(2,4,'2024-02-14',1),(2,10,'2024-03-01',1),(3,3,'2024-01-25',1),(3,6,'2024-02-20',1),(4,7,'2024-01-30',0),(4,8,'2024-02-25',1),(5,1,'2024-02-05',1),(5,2,'2024-03-10',0),(6,4,'2024-02-12',1),(6,6,'2024-03-15',0),(7,3,'2024-01-18',1),(7,5,'2024-02-28',1),(8,8,'2024-02-08',1),(8,10,'2024-03-12',0),(9,7,'2024-01-22',0),(9,9,'2024-02-15',1),(10,1,'2024-02-18',1),(10,4,'2024-03-08',1),(12,6,'2025-07-22',0),(12,58,'2025-07-22',0),(14,4,'2025-07-29',0),(14,6,'2025-07-22',0),(33,5,'2025-07-28',0),(36,1,'2025-07-29',0),(36,5,'2025-07-29',0);
/*!40000 ALTER TABLE `FAV_LIST_SHOW` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GENRE`
--

DROP TABLE IF EXISTS `GENRE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GENRE` (
  `GENRE_ID` int NOT NULL AUTO_INCREMENT,
  `GENRE_NAME` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`GENRE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GENRE`
--

LOCK TABLES `GENRE` WRITE;
/*!40000 ALTER TABLE `GENRE` DISABLE KEYS */;
INSERT INTO `GENRE` VALUES (1,'Action'),(2,'Adventure'),(3,'Comedy'),(4,'Drama'),(5,'Fantasy'),(6,'Horror'),(7,'Mystery'),(8,'Romance'),(9,'Sci-Fi'),(10,'Thriller'),(11,'Animation'),(12,'Crime'),(13,'Family'),(14,'Musical'),(15,'War'),(16,'Biography'),(17,'Psychological');
/*!40000 ALTER TABLE `GENRE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LANGUAGE`
--

DROP TABLE IF EXISTS `LANGUAGE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LANGUAGE` (
  `LANGUAGE_ID` int NOT NULL AUTO_INCREMENT,
  `LANGUAGE_NAME` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`LANGUAGE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LANGUAGE`
--

LOCK TABLES `LANGUAGE` WRITE;
/*!40000 ALTER TABLE `LANGUAGE` DISABLE KEYS */;
INSERT INTO `LANGUAGE` VALUES (1,'English'),(2,'Spanish'),(3,'French'),(4,'German'),(5,'Japanese'),(6,'Korean'),(7,'Hindi'),(8,'Portuguese'),(9,'Mandarin'),(10,'Italian');
/*!40000 ALTER TABLE `LANGUAGE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MARKETING_ADMIN`
--

DROP TABLE IF EXISTS `MARKETING_ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MARKETING_ADMIN` (
  `ADMIN_ID` int NOT NULL,
  PRIMARY KEY (`ADMIN_ID`),
  CONSTRAINT `FK_MARKETING_ADMIN_ID` FOREIGN KEY (`ADMIN_ID`) REFERENCES `ADMIN` (`ADMIN_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MARKETING_ADMIN`
--

LOCK TABLES `MARKETING_ADMIN` WRITE;
/*!40000 ALTER TABLE `MARKETING_ADMIN` DISABLE KEYS */;
INSERT INTO `MARKETING_ADMIN` VALUES (4),(7);
/*!40000 ALTER TABLE `MARKETING_ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `METHOD`
--

DROP TABLE IF EXISTS `METHOD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `METHOD` (
  `METHOD_ID` int NOT NULL AUTO_INCREMENT,
  `METHOD_NAME` varchar(20) NOT NULL,
  `METHOD_ICON` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`METHOD_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `METHOD`
--

LOCK TABLES `METHOD` WRITE;
/*!40000 ALTER TABLE `METHOD` DISABLE KEYS */;
INSERT INTO `METHOD` VALUES (1,'PayPal','?'),(2,'Card','?'),(3,'BKash','?');
/*!40000 ALTER TABLE `METHOD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MOBILE_BANKING`
--

DROP TABLE IF EXISTS `MOBILE_BANKING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MOBILE_BANKING` (
  `METHOD_ID` int NOT NULL,
  `TRANSACTION_ID` int NOT NULL,
  `PROVIDER_NAME` varchar(20) DEFAULT NULL,
  `MOBILE_NUMBER` varchar(15) DEFAULT NULL,
  `ACCOUNT_EMAIL` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`TRANSACTION_ID`),
  KEY `FK_MOBILE_METHOD_ID` (`METHOD_ID`),
  CONSTRAINT `FK_MOBILE_METHOD_ID` FOREIGN KEY (`METHOD_ID`) REFERENCES `METHOD` (`METHOD_ID`),
  CONSTRAINT `FK_MOBILE_TRANSACTION_ID` FOREIGN KEY (`TRANSACTION_ID`) REFERENCES `TRANSACTION` (`TRANSACTION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MOBILE_BANKING`
--

LOCK TABLES `MOBILE_BANKING` WRITE;
/*!40000 ALTER TABLE `MOBILE_BANKING` DISABLE KEYS */;
/*!40000 ALTER TABLE `MOBILE_BANKING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NOTIFICATIONS`
--

DROP TABLE IF EXISTS `NOTIFICATIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NOTIFICATIONS` (
  `NOTIF_ID` bigint NOT NULL AUTO_INCREMENT,
  `MESSAGE` varchar(255) NOT NULL,
  `TYPE` enum('movie_update','admin_notice','comment_reply','billing_update','profile_update') NOT NULL,
  `DATA` json DEFAULT NULL COMMENT 'Routing data: movie_id, comment_id, etc.',
  `CREATED_AT` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`NOTIF_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NOTIFICATIONS`
--

LOCK TABLES `NOTIFICATIONS` WRITE;
/*!40000 ALTER TABLE `NOTIFICATIONS` DISABLE KEYS */;
INSERT INTO `NOTIFICATIONS` VALUES (4,'Please update your profile information','profile_update','{\"notice_type\": \"profile_update\"}','2025-07-18 03:27:02'),(5,'Welcome to our platform!','admin_notice','{}','2025-07-18 03:54:43'),(6,'New episodes of Breaking Bad are now available!','movie_update','{\"movie_id\": 1, \"show_title\": \"Breaking Bad\"}','2025-07-18 04:29:39'),(7,'Administrator has posted an important notice about the platform','admin_notice','{\"priority\": \"high\"}','2025-07-18 04:29:39'),(8,'Someone replied to your comment on The Wire','comment_reply','{\"comment_id\": 123, \"show_title\": \"The Wire\"}','2025-07-18 04:29:39'),(9,'Your favorite show The Sopranos has been updated with new content','movie_update','{\"movie_id\": 2, \"show_title\": \"The Sopranos\"}','2025-07-18 04:29:39'),(10,'New season of your watchlisted show is now streaming','movie_update','{\"movie_id\": 3, \"show_title\": \"Stranger Things\"}','2025-07-18 04:29:39'),(13,'New episode \"check\" available for Unknown Show','movie_update','{\"movie_id\": 17, \"show_title\": null}','2025-07-18 05:02:46'),(14,'New episode \"check\" available for Unknown Show','movie_update','{\"movie_id\": 17, \"show_title\": null}','2025-07-18 05:04:14'),(15,'New episode \"check\" available for Unknown Show','movie_update','{\"movie_id\": 17, \"show_title\": null}','2025-07-18 05:09:40'),(16,'New episode \"check\" available for Breaking Bad','movie_update','{\"movie_id\": 17, \"show_title\": \"Breaking Bad\"}','2025-07-18 05:10:53'),(17,'New episode \"check\" available for Breaking Bad Season 1','movie_update','{\"movie_id\": 17, \"show_title\": \"Breaking Bad Season 1\"}','2025-07-18 05:14:44'),(18,'Someone replied to your comment on Oppenheimer','comment_reply','{\"reply_id\": 101, \"comment_id\": 97, \"show_title\": \"Oppenheimer\", \"episode_title\": \"Full Movie\", \"show_episode_id\": 6}','2025-07-18 05:19:58'),(19,'Someone replied to your comment on Oppenheimer','comment_reply','{\"movie_id\": 6, \"reply_id\": 102, \"comment_id\": 97, \"show_title\": \"Oppenheimer\", \"episode_title\": \"Full Movie\", \"show_episode_id\": 6}','2025-07-18 05:49:46'),(20,'Someone replied to your comment on Breaking Bad Season 1','comment_reply','{\"movie_id\": 17, \"reply_id\": 105, \"comment_id\": 104, \"show_title\": \"Breaking Bad Season 1\", \"episode_title\": \"check\", \"show_episode_id\": 72}','2025-07-18 05:54:11'),(21,'Someone replied to your comment on Breaking Bad Season 1','comment_reply','{\"movie_id\": 17, \"reply_id\": 106, \"comment_id\": 103, \"show_title\": \"Breaking Bad Season 1\", \"episode_title\": \"check\", \"show_episode_id\": 72}','2025-07-18 05:58:52'),(22,'Someone replied to your comment on Oppenheimer','comment_reply','{\"movie_id\": 6, \"reply_id\": 107, \"comment_id\": 97, \"show_title\": \"Oppenheimer\", \"episode_title\": \"Full Movie\", \"show_episode_id\": 6}','2025-07-23 16:01:44'),(23,'Admin replied to your support request: Technical Support','admin_notice','{\"request_id\": 2}','2025-07-23 17:08:14'),(24,'Please update your billing information','billing_update','{}','2025-07-24 08:12:51'),(25,'Admin replied to your support request: Technical Support','admin_notice','{\"request_id\": 4}','2025-07-28 15:26:05'),(26,'Admin replied to your support request: Technical Support','admin_notice','{\"request_id\": 5}','2025-07-28 16:09:09'),(27,'Admin replied to your support request: Technical Support','admin_notice','{\"request_id\": 6}','2025-07-28 18:17:03'),(28,'Admin replied to your support request: General Inquiry','admin_notice','{\"request_id\": 9}','2025-07-28 19:03:18'),(29,'Admin replied to your support request: Bug Report','admin_notice','{\"request_id\": 8}','2025-07-28 19:03:25'),(30,'Admin replied to your support request: Feature Request','admin_notice','{\"request_id\": 10}','2025-07-28 19:05:11');
/*!40000 ALTER TABLE `NOTIFICATIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PAYMENT_DETAILS`
--

DROP TABLE IF EXISTS `PAYMENT_DETAILS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PAYMENT_DETAILS` (
  `PAYMENT_DETAIL_ID` int NOT NULL AUTO_INCREMENT,
  `TRANSACTION_ID` int NOT NULL,
  `PAYMENT_TYPE` varchar(20) NOT NULL,
  `PAYPAL_ID` varchar(50) DEFAULT NULL,
  `PAYPAL_EMAIL` varchar(100) DEFAULT NULL,
  `PROVIDER_NAME` varchar(50) DEFAULT NULL,
  `MOBILE_NUMBER` varchar(20) DEFAULT NULL,
  `ACCOUNT_EMAIL` varchar(100) DEFAULT NULL,
  `CARD_ID` varchar(50) DEFAULT NULL,
  `CARD_VCC` varchar(10) DEFAULT NULL,
  `EXPIRY_DATE` date DEFAULT NULL,
  `CARD_HOLDER_NAME` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`PAYMENT_DETAIL_ID`),
  UNIQUE KEY `UK_PAYMENT_DETAILS_TRANSACTION` (`TRANSACTION_ID`),
  KEY `IDX_PAYMENT_TYPE` (`PAYMENT_TYPE`),
  CONSTRAINT `FK_PAYMENT_DETAILS_TRANSACTION_ID` FOREIGN KEY (`TRANSACTION_ID`) REFERENCES `TRANSACTION` (`TRANSACTION_ID`) ON DELETE CASCADE,
  CONSTRAINT `CHK_CARD_DETAILS` CHECK (((`PAYMENT_TYPE` <> _utf8mb4'CARD') or ((`CARD_ID` is not null) and (`CARD_VCC` is not null) and (`EXPIRY_DATE` is not null) and (`CARD_HOLDER_NAME` is not null)))),
  CONSTRAINT `CHK_MOBILE_BANKING_DETAILS` CHECK (((`PAYMENT_TYPE` <> _utf8mb4'MOBILE_BANKING') or ((`PROVIDER_NAME` is not null) and (`MOBILE_NUMBER` is not null)))),
  CONSTRAINT `CHK_PAYPAL_DETAILS` CHECK (((`PAYMENT_TYPE` <> _utf8mb4'PAYPAL') or ((`PAYPAL_ID` is not null) and (`PAYPAL_EMAIL` is not null)))),
  CONSTRAINT `PAYMENT_DETAILS_chk_1` CHECK ((`PAYMENT_TYPE` in (_utf8mb4'PAYPAL',_utf8mb4'MOBILE_BANKING',_utf8mb4'CARD')))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PAYMENT_DETAILS`
--

LOCK TABLES `PAYMENT_DETAILS` WRITE;
/*!40000 ALTER TABLE `PAYMENT_DETAILS` DISABLE KEYS */;
INSERT INTO `PAYMENT_DETAILS` VALUES (1,1,'PAYPAL','PP-TRX-1001','user1_paypal@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,2,'MOBILE_BANKING',NULL,NULL,'Bkash','01710000001','user2_mb@example.com',NULL,NULL,NULL,NULL),(3,3,'CARD',NULL,NULL,NULL,NULL,NULL,'CARD-3001','123','2027-11-30','User Three'),(4,4,'MOBILE_BANKING',NULL,NULL,'Nagad','01820000002','user4_mb@example.com',NULL,NULL,NULL,NULL),(5,5,'PAYPAL','PP-TRX-1005','user5_paypal@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,6,'CARD',NULL,NULL,NULL,NULL,NULL,'CARD-3006','321','2028-06-15','User Six'),(7,7,'MOBILE_BANKING',NULL,NULL,'Rocket','01930000003','user7_mb@example.com',NULL,NULL,NULL,NULL),(8,8,'PAYPAL','PP-TRX-1008','user8_paypal@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,9,'CARD',NULL,NULL,NULL,NULL,NULL,'CARD-3009','456','2026-09-01','User Nine'),(10,10,'MOBILE_BANKING',NULL,NULL,'Bkash','01740000004','user10_mb@example.com',NULL,NULL,NULL,NULL),(11,11,'PAYPAL','PP-TRX-1011','user1_paypal@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,12,'MOBILE_BANKING',NULL,NULL,'Nagad','01850000005','user2_mb@example.com',NULL,NULL,NULL,NULL),(13,13,'CARD',NULL,NULL,NULL,NULL,NULL,'CARD-3013','789','2029-02-28','User Three'),(14,14,'PAYPAL','PP-TRX-1014','user4_paypal@example.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,15,'MOBILE_BANKING',NULL,NULL,'Rocket','01960000006','user5_mb@example.com',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `PAYMENT_DETAILS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PAYPAL`
--

DROP TABLE IF EXISTS `PAYPAL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PAYPAL` (
  `METHOD_ID` int NOT NULL,
  `TRANSACTION_ID` int NOT NULL,
  `PAYPAL_ID` varchar(20) DEFAULT NULL,
  `PAYPAL_EMAIL` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`TRANSACTION_ID`),
  KEY `FK_PAYPAL_METHOD_ID` (`METHOD_ID`),
  CONSTRAINT `FK_PAYPAL_METHOD_ID` FOREIGN KEY (`METHOD_ID`) REFERENCES `METHOD` (`METHOD_ID`),
  CONSTRAINT `FK_PAYPAL_TRANSACTION_ID` FOREIGN KEY (`TRANSACTION_ID`) REFERENCES `TRANSACTION` (`TRANSACTION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PAYPAL`
--

LOCK TABLES `PAYPAL` WRITE;
/*!40000 ALTER TABLE `PAYPAL` DISABLE KEYS */;
INSERT INTO `PAYPAL` VALUES (1,23,'sdvav','sdvd@gmail.com'),(1,40,'Abc','abc@yahoo.vom'),(1,41,'Abc','abc@yahoo.vom');
/*!40000 ALTER TABLE `PAYPAL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PERSON`
--

DROP TABLE IF EXISTS `PERSON`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PERSON` (
  `PERSON_ID` int NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(50) NOT NULL,
  `PASSWORD_HASHED` varchar(60) NOT NULL,
  PRIMARY KEY (`PERSON_ID`),
  UNIQUE KEY `UNIQUE_EMAIL` (`EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PERSON`
--

LOCK TABLES `PERSON` WRITE;
/*!40000 ALTER TABLE `PERSON` DISABLE KEYS */;
INSERT INTO `PERSON` VALUES (1,'admin@streamflix.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(2,'content.admin@streamflix.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(3,'support.admin@streamflix.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(4,'marketing@streamflix.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(5,'warner.bros@wb.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(6,'disney@disney.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(7,'universal@universal.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(8,'paramount@paramount.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(9,'sony@sony.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(10,'netflix@netflix.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(101,'john.doe@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(102,'jane.smith@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(103,'mike.johnson@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(104,'sarah.williams@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(105,'david.brown@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(106,'lisa.davis@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(107,'chris.wilson@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(108,'anna.taylor@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(109,'robert.anderson@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(110,'emily.thomas@email.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(111,'rnb@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(113,'check@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(114,'new@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(115,'checsdsvk@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(116,'checsdsdsvk@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(117,'checsdsdssvk@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(118,'cheassdadck@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(119,'chedfsck@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(120,'contentadmin@streamflix.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(121,'supportadmin@streamflix.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(122,'marketingadmin@streamflix.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(123,'sth@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(124,'newok@gmail.com','$2b$10$KklL9/BkjmHufBO7/PPtFuajGHMMdeVVnxJFPj1Kknn50K.ceIPEC'),(125,'rafidmostafiz30145@gmail.com','$2b$10$WbPoYCGhyimQuX8rVjVu4eP3GHVUy4.gZM5wQCGnxG2ZZCr7aEfZ6'),(126,'asdasd@gmail.com','$2b$10$TJVi4FeO0xQUQV/YyZ9Ph.vG0iVfnMNA97n311Lv8L5bU/00k6RsC'),(127,'asdasd1@gmail.com','$2b$10$ABnLikLbWW0m1oGEuAb6AuyRrd5yor.Ds07V8nAisofgTBA6St542'),(128,'tahmidkhan249@gmail.com','$2b$10$vRmDqXqgdUHItesGsugEUuRQ2NPVqyw2061Zmk9eN6wAkoQ0Qc0f.'),(129,'hehe@d.com','$2b$10$BkKk97VbGToarZFOD/FlUutB27Fp4.vY.V1MhWkr4aGOvAefw.rbK'),(130,'nigga123@nigga.com','$2b$10$hpUWCWDtnOb1ruj5U.7dwuHfFTgpwxuAuB9ImbwdcAmilw42p7BsW'),(131,'anabil.das2003@gmail.com','$2b$10$ZSNuBvPw7LYR38hc4SpZ/.2ZaG5SDNYQXqrIckwVStCQeXeWtmkDG'),(132,'roybishesh77@gmail.com','$2b$10$9IJ0t2UP5ax1dnG36g2kKOg6VXJP8bll8FhC550IexzR7K3VuEul2'),(133,'bishmitroy@gmail.com','$2b$10$UGrC17PsWvJlPvhHhqO7DOFQ9DECmk1alqMAZ/z.u9oUeoD3ZBT1K'),(134,'rahmanhafiz.buet@gmail.com','$2b$10$ATF1hQSnuqfksbG.FJP/SOvZVFpxeK9n/28Oihc81Ycb.1T.dGAcy'),(135,'abc@yahoo.vom','$2b$10$/pXslgsAz40QhD3BYPA8lOx8dmAOF7PNxLBX7GjdE/IXc1BGLDnWS'),(136,'user1@gmail.com','$2b$10$PinS8lOVXeYUZy.0uDd4y.2CSHQ9ngbDifwV8bLVO7dFlGvkLOGT.'),(137,'adityaroy.jpg@gmail.com','$2b$10$aaasuEm18sTxZrtYrL3K..4jWbcR0s70iKx2l.v/5MjKrVrWYXV9C');
/*!40000 ALTER TABLE `PERSON` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROMOTION`
--

DROP TABLE IF EXISTS `PROMOTION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROMOTION` (
  `PROMOTION_ID` int NOT NULL AUTO_INCREMENT,
  `ADMIN_ID` int DEFAULT NULL,
  `SUBSCRIPTION_TYPE_ID` int DEFAULT NULL,
  `PROMO_CODE` varchar(50) DEFAULT NULL,
  `DISCOUNT_RATE` int DEFAULT NULL,
  `START_DATE` date DEFAULT NULL,
  `END_DATE` date DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`PROMOTION_ID`),
  KEY `FK_PROMOTION_ADMIN_ID` (`ADMIN_ID`),
  KEY `FK_PROMOTION_SUBSCRIPTION_TYPE_ID` (`SUBSCRIPTION_TYPE_ID`),
  CONSTRAINT `FK_PROMOTION_ADMIN_ID` FOREIGN KEY (`ADMIN_ID`) REFERENCES `MARKETING_ADMIN` (`ADMIN_ID`),
  CONSTRAINT `FK_PROMOTION_SUBSCRIPTION_TYPE_ID` FOREIGN KEY (`SUBSCRIPTION_TYPE_ID`) REFERENCES `SUBSCRIPTION_TYPE` (`SUBSCRIPTION_TYPE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROMOTION`
--

LOCK TABLES `PROMOTION` WRITE;
/*!40000 ALTER TABLE `PROMOTION` DISABLE KEYS */;
INSERT INTO `PROMOTION` VALUES (1,4,1,'NEWUSER50',50,'2023-12-28','2026-05-07','Welcome offer for new subscribers - 50% off Basic Plan'),(2,4,2,'UPGRADE25',25,'2024-02-01','2026-05-11','Upgrade to Standard Plan with 25% discount'),(3,4,3,'PREMIUM30',30,'2024-01-15','2026-05-11','Premium Plan special offer - 30% off first month'),(4,4,4,'ANNUAL2024',20,'2024-01-01','2026-05-11','Annual subscription discount - 20% off yearly plans'),(6,4,6,'BLACKFRIDAY',35,'2024-11-25','2026-05-11','Black Friday special - 35% off Premium Annual'),(7,4,1,'SUMMER2024',15,'2024-06-01','2026-05-11','Summer special discount on Basic Plan'),(8,4,2,'FAMILY20',20,'2024-01-01','2026-05-11','Family plan discount for Standard subscription');
/*!40000 ALTER TABLE `PROMOTION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PUBLISHER`
--

DROP TABLE IF EXISTS `PUBLISHER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PUBLISHER` (
  `PUBLISHER_ID` int NOT NULL AUTO_INCREMENT,
  `PERSON_ID` int DEFAULT NULL,
  `CONTRACT_ID` varchar(12) DEFAULT NULL,
  `PUBLISHER_NAME` varchar(50) DEFAULT NULL,
  `CONTRACT_DATE` date DEFAULT NULL,
  `CONTRACT_DURATION_DAYS` int DEFAULT NULL,
  `ROYALTY` decimal(10,2) DEFAULT NULL,
  `MIN_GUARANTEE` decimal(10,2) NOT NULL,
  `IS_ACTIVE` int DEFAULT NULL,
  PRIMARY KEY (`PUBLISHER_ID`),
  UNIQUE KEY `UK_PUBLISHER_CONTRACT_ID` (`CONTRACT_ID`),
  KEY `FK_PUBLISHER_PERSON_ID` (`PERSON_ID`),
  CONSTRAINT `FK_PUBLISHER_PERSON_ID` FOREIGN KEY (`PERSON_ID`) REFERENCES `PERSON` (`PERSON_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PUBLISHER`
--

LOCK TABLES `PUBLISHER` WRITE;
/*!40000 ALTER TABLE `PUBLISHER` DISABLE KEYS */;
INSERT INTO `PUBLISHER` VALUES (1,5,'WB001','Warner Bros Pictures','2025-07-24',4380,0.05,35.99,1),(2,6,'DIS001','Disney Studios','2025-07-25',365,0.05,19.99,1),(3,7,'UNI001','Universal Pictures','2025-07-25',365,0.05,19.99,1),(4,8,'PAR001','Paramount Pictures','2025-07-25',365,0.05,19.99,1),(5,9,'SON001','Sony Pictures','2025-07-25',365,0.05,19.99,1),(6,10,'NET001','Netflix Originals','2025-07-25',365,0.05,19.99,1);
/*!40000 ALTER TABLE `PUBLISHER` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_deactivate_publisher_shows` AFTER UPDATE ON `PUBLISHER` FOR EACH ROW BEGIN
  -- Check if is_active changed from 1 to 0
  IF OLD.IS_ACTIVE = 1 AND NEW.IS_ACTIVE = 0 THEN
    UPDATE SHOWS
    SET REMOVED = 1
    WHERE PUBLISHER_ID = NEW.PUBLISHER_ID;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_insert_min_guarantee_on_update` AFTER UPDATE ON `PUBLISHER` FOR EACH ROW BEGIN
  INSERT INTO PUBLISHER_EARNINGS (
    PUBLISHER_ID,
    EARNING_TYPE,
    AMOUNT,
    PAID_DATE
  ) VALUES (
    NEW.PUBLISHER_ID,
    'MINIMUM_GUARANTEE',
    NEW.MIN_GUARANTEE,
    CURDATE()
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_toggle_publisher_shows` AFTER UPDATE ON `PUBLISHER` FOR EACH ROW BEGIN
  -- Deactivating publisher
  IF OLD.IS_ACTIVE = 1 AND NEW.IS_ACTIVE = 0 THEN
    UPDATE SHOWS
    SET REMOVED = 1
    WHERE PUBLISHER_ID = NEW.PUBLISHER_ID;
  END IF;

  -- Reactivating publisher
  IF OLD.IS_ACTIVE = 0 AND NEW.IS_ACTIVE = 1 THEN
    UPDATE SHOWS
    SET REMOVED = 0
    WHERE PUBLISHER_ID = NEW.PUBLISHER_ID;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `PUBLISHER_EARNINGS`
--

DROP TABLE IF EXISTS `PUBLISHER_EARNINGS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PUBLISHER_EARNINGS` (
  `EARNING_ID` int NOT NULL AUTO_INCREMENT,
  `PUBLISHER_ID` int NOT NULL,
  `EARNING_TYPE` enum('ROYALTY','MINIMUM_GUARANTEE') NOT NULL,
  `AMOUNT` decimal(12,2) NOT NULL,
  `PAID_DATE` date DEFAULT NULL,
  PRIMARY KEY (`EARNING_ID`),
  KEY `PUBLISHER_ID` (`PUBLISHER_ID`),
  CONSTRAINT `PUBLISHER_EARNINGS_ibfk_1` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `PUBLISHER` (`PUBLISHER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PUBLISHER_EARNINGS`
--

LOCK TABLES `PUBLISHER_EARNINGS` WRITE;
/*!40000 ALTER TABLE `PUBLISHER_EARNINGS` DISABLE KEYS */;
INSERT INTO `PUBLISHER_EARNINGS` VALUES (1,1,'ROYALTY',0.05,'2025-07-25'),(2,1,'ROYALTY',0.05,'2025-07-21'),(3,1,'ROYALTY',0.05,'2025-07-25'),(4,1,'ROYALTY',0.05,'2025-07-19'),(5,1,'ROYALTY',0.05,'2025-07-20'),(6,1,'ROYALTY',0.05,'2025-07-22'),(7,1,'ROYALTY',0.05,'2025-07-23'),(8,1,'ROYALTY',0.05,'2025-07-23'),(9,2,'ROYALTY',0.05,'2025-07-18'),(10,2,'ROYALTY',0.05,'2025-07-23'),(11,2,'ROYALTY',0.05,'2025-07-22'),(12,3,'ROYALTY',0.05,'2025-07-21'),(13,3,'ROYALTY',0.05,'2025-07-23'),(14,4,'ROYALTY',0.05,'2025-07-20'),(15,4,'ROYALTY',0.05,'2025-07-24'),(16,4,'ROYALTY',0.05,'2025-07-20'),(17,1,'ROYALTY',0.05,'2025-07-19'),(18,1,'ROYALTY',0.05,'2025-07-21'),(19,1,'ROYALTY',0.05,'2025-07-21'),(20,5,'ROYALTY',0.05,'2025-07-24'),(21,5,'ROYALTY',0.05,'2025-07-22'),(22,5,'ROYALTY',0.05,'2025-07-19'),(23,1,'ROYALTY',0.05,'2025-07-22'),(24,1,'ROYALTY',0.05,'2025-07-25'),(25,1,'ROYALTY',0.05,'2025-07-25'),(26,6,'ROYALTY',0.05,'2025-07-22'),(27,6,'ROYALTY',0.05,'2025-07-24'),(28,2,'ROYALTY',0.05,'2025-07-24'),(29,2,'ROYALTY',0.05,'2025-07-19'),(30,6,'ROYALTY',0.05,'2025-07-22'),(31,6,'ROYALTY',0.05,'2025-07-23'),(32,6,'ROYALTY',0.05,'2025-07-22'),(33,1,'MINIMUM_GUARANTEE',34.99,'2025-07-18'),(34,2,'MINIMUM_GUARANTEE',19.99,'2025-07-18'),(35,3,'MINIMUM_GUARANTEE',19.99,'2025-07-18'),(36,4,'MINIMUM_GUARANTEE',19.99,'2025-07-18'),(37,5,'MINIMUM_GUARANTEE',19.99,'2025-07-18'),(38,6,'MINIMUM_GUARANTEE',19.99,'2025-07-18'),(40,1,'MINIMUM_GUARANTEE',34.99,'2025-07-25'),(41,2,'MINIMUM_GUARANTEE',19.99,'2025-07-25'),(42,3,'MINIMUM_GUARANTEE',19.99,'2025-07-25'),(43,4,'MINIMUM_GUARANTEE',19.99,'2025-07-25'),(44,5,'MINIMUM_GUARANTEE',19.99,'2025-07-25'),(45,6,'MINIMUM_GUARANTEE',19.99,'2025-07-25'),(46,2,'ROYALTY',0.05,'2025-07-25'),(47,1,'ROYALTY',0.05,'2025-07-26'),(48,2,'ROYALTY',0.05,'2025-07-26'),(49,1,'MINIMUM_GUARANTEE',35.99,'2025-07-28'),(50,1,'ROYALTY',0.05,'2025-07-28'),(51,1,'ROYALTY',0.05,'2025-07-29');
/*!40000 ALTER TABLE `PUBLISHER_EARNINGS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RATING`
--

DROP TABLE IF EXISTS `RATING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RATING` (
  `USER_ID` int NOT NULL,
  `SHOW_EPISODE_ID` int NOT NULL,
  `RATING_VALUE` int NOT NULL,
  `RATING_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ID`,`SHOW_EPISODE_ID`),
  KEY `FK_RATING_SHOW_EPISODE_ID` (`SHOW_EPISODE_ID`),
  CONSTRAINT `FK_RATING_SHOW_EPISODE_ID` FOREIGN KEY (`SHOW_EPISODE_ID`) REFERENCES `SHOW_EPISODE` (`SHOW_EPISODE_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_RATING_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE,
  CONSTRAINT `RATING_chk_1` CHECK ((`RATING_VALUE` between 1 and 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RATING`
--

LOCK TABLES `RATING` WRITE;
/*!40000 ALTER TABLE `RATING` DISABLE KEYS */;
INSERT INTO `RATING` VALUES (12,57,8,'2025-07-24 06:49:40'),(14,1,10,'2025-07-25 11:51:41'),(14,56,10,'2025-07-28 15:10:35'),(14,57,8,'2025-07-24 07:06:26'),(24,57,9,'2025-07-24 06:49:57'),(25,57,9,'2025-07-24 11:55:21'),(28,9,8,'2025-07-28 18:11:14');
/*!40000 ALTER TABLE `RATING` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_update_show_rating_insert` AFTER INSERT ON `RATING` FOR EACH ROW BEGIN
  DECLARE v_show_id INT;
  DECLARE v_avg_rating DECIMAL(4,2);
  
  -- Get the show ID for the inserted episode
  SELECT SHOW_ID INTO v_show_id
  FROM SHOW_EPISODE
  WHERE SHOW_EPISODE_ID = NEW.SHOW_EPISODE_ID;
  
  -- Compute the average rating of all episodes of the show
  SELECT COALESCE(AVG(R.RATING_VALUE), 0) INTO v_avg_rating
  FROM RATING R
  JOIN SHOW_EPISODE E ON R.SHOW_EPISODE_ID = E.SHOW_EPISODE_ID
  WHERE E.SHOW_ID = v_show_id;
  
  -- Update the SHOWS table's RATING column with 2 decimal places
  UPDATE SHOWS
  SET RATING = ROUND(v_avg_rating, 2)
  WHERE SHOW_ID = v_show_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_update_show_rating_update` AFTER UPDATE ON `RATING` FOR EACH ROW BEGIN
  DECLARE v_show_id INT;
  DECLARE v_avg_rating DECIMAL(4,2);

  -- Get the show ID for the updated episode
  SELECT SHOW_ID INTO v_show_id
  FROM SHOW_EPISODE
  WHERE SHOW_EPISODE_ID = NEW.SHOW_EPISODE_ID;

  -- Compute the average rating of all episodes of the show
  SELECT COALESCE(AVG(R.RATING_VALUE), 0) INTO v_avg_rating
  FROM RATING R
  JOIN SHOW_EPISODE E ON R.SHOW_EPISODE_ID = E.SHOW_EPISODE_ID
  WHERE E.SHOW_ID = v_show_id;

  -- Update the SHOWS table's RATING column
  UPDATE SHOWS
  SET RATING = ROUND(v_avg_rating, 2)
  WHERE SHOW_ID = v_show_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_update_show_rating_delete` AFTER DELETE ON `RATING` FOR EACH ROW BEGIN
  DECLARE v_show_id INT;
  DECLARE v_avg_rating DECIMAL(4,2);
  
  -- Get the show ID for the deleted episode
  SELECT SHOW_ID INTO v_show_id
  FROM SHOW_EPISODE
  WHERE SHOW_EPISODE_ID = OLD.SHOW_EPISODE_ID;
  
  -- Compute the average rating of all episodes of the show
  SELECT COALESCE(AVG(R.RATING_VALUE), 0) INTO v_avg_rating
  FROM RATING R
  JOIN SHOW_EPISODE E ON R.SHOW_EPISODE_ID = E.SHOW_EPISODE_ID
  WHERE E.SHOW_ID = v_show_id;
  
  -- Update the SHOWS table's RATING column
  UPDATE SHOWS
  SET RATING = ROUND(v_avg_rating, 2)
  WHERE SHOW_ID = v_show_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `REPORT`
--

DROP TABLE IF EXISTS `REPORT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REPORT` (
  `REPORT_ID` int NOT NULL AUTO_INCREMENT,
  `USER_ID` int DEFAULT NULL,
  `COMMENT_ID` int DEFAULT NULL,
  `REPORT_TIME` datetime DEFAULT NULL,
  `REPORT_TEXT` varchar(200) DEFAULT NULL,
  `ADMIN_ID` int DEFAULT NULL,
  `CHECKED` int DEFAULT NULL,
  PRIMARY KEY (`REPORT_ID`),
  KEY `FK_REPORT_USER_ID` (`USER_ID`),
  KEY `FK_REPORT_COMMENT_ID` (`COMMENT_ID`),
  KEY `FK_REPORT_ADMIN_ID` (`ADMIN_ID`),
  CONSTRAINT `FK_REPORT_ADMIN_ID` FOREIGN KEY (`ADMIN_ID`) REFERENCES `SUPPORT_ADMIN` (`ADMIN_ID`),
  CONSTRAINT `FK_REPORT_COMMENT_ID` FOREIGN KEY (`COMMENT_ID`) REFERENCES `COMMENT` (`COMMENT_ID`),
  CONSTRAINT `FK_REPORT_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REPORT`
--

LOCK TABLES `REPORT` WRITE;
/*!40000 ALTER TABLE `REPORT` DISABLE KEYS */;
INSERT INTO `REPORT` VALUES (1,2,3,'2025-06-27 12:45:00','Inappropriate language in the comment.',3,0),(2,5,14,'2025-06-27 13:00:00','Contains spoilers without warning.',3,0),(3,7,24,'2025-06-27 13:15:00','This comment is offensive.',3,1),(4,4,19,'2025-06-27 13:30:00','Reported for spam.',3,0),(5,9,23,'2025-06-27 13:45:00','The comment is irrelevant to the episode.',3,0),(8,14,1,'2025-07-17 23:55:50','checking',NULL,2),(9,14,5,'2025-07-17 23:57:40','CHECK',3,1),(10,14,6,'2025-07-18 00:06:12','xvadzd',3,1),(11,14,102,'2025-07-23 14:24:31','blabla',3,2),(12,14,110,'2025-07-23 22:02:12',NULL,3,NULL),(13,12,97,'2025-07-23 22:12:07','chk',3,NULL),(14,6,15,'2025-07-23 22:29:47','chk',3,0),(15,14,107,'2025-07-28 15:28:08','ASDAD',3,2);
/*!40000 ALTER TABLE `REPORT` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `mark_comment_deleted_on_report_check` AFTER UPDATE ON `REPORT` FOR EACH ROW BEGIN
  -- Only act when CHECKED value is changed to 2
  IF NEW.CHECKED = 2 AND OLD.CHECKED <> 2 THEN
    UPDATE COMMENT
    SET DELETED = 1
    WHERE COMMENT_ID = NEW.COMMENT_ID;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `REPORT_VIOLATION`
--

DROP TABLE IF EXISTS `REPORT_VIOLATION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REPORT_VIOLATION` (
  `REPORT_ID` int NOT NULL,
  `VIOLATION_ID` int NOT NULL,
  PRIMARY KEY (`REPORT_ID`,`VIOLATION_ID`),
  KEY `FK_REPORT_VIOLATION_VIOLATION_ID` (`VIOLATION_ID`),
  CONSTRAINT `FK_REPORT_VIOLATION_REPORT_ID` FOREIGN KEY (`REPORT_ID`) REFERENCES `REPORT` (`REPORT_ID`),
  CONSTRAINT `FK_REPORT_VIOLATION_VIOLATION_ID` FOREIGN KEY (`VIOLATION_ID`) REFERENCES `VIOLATION` (`VIOLATION_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REPORT_VIOLATION`
--

LOCK TABLES `REPORT_VIOLATION` WRITE;
/*!40000 ALTER TABLE `REPORT_VIOLATION` DISABLE KEYS */;
INSERT INTO `REPORT_VIOLATION` VALUES (4,1),(8,1),(3,2),(9,2),(13,2),(8,3),(9,4),(8,5),(12,5),(9,6),(10,6),(15,6),(2,7),(12,7),(1,8),(10,8),(14,8),(5,9),(11,9),(10,10);
/*!40000 ALTER TABLE `REPORT_VIOLATION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOWS`
--

DROP TABLE IF EXISTS `SHOWS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOWS` (
  `SHOW_ID` int NOT NULL AUTO_INCREMENT,
  `STATUS_ID` int DEFAULT NULL,
  `CATEGORY_ID` int DEFAULT NULL,
  `PUBLISHER_ID` int DEFAULT NULL,
  `AGE_RESTRICTION_ID` int DEFAULT NULL,
  `TITLE` varchar(50) DEFAULT NULL,
  `THUMBNAIL` varchar(100) DEFAULT NULL,
  `DESCRIPTION` varchar(3000) DEFAULT NULL,
  `TEASER` varchar(100) DEFAULT NULL,
  `RATING` decimal(4,2) DEFAULT NULL,
  `RELEASE_DATE` date DEFAULT NULL,
  `SEASON` int DEFAULT NULL,
  `LICENSE` varchar(50) DEFAULT NULL,
  `ADMIN_ID` int DEFAULT NULL,
  `WATCH_COUNT` int DEFAULT NULL,
  `BANNER` varchar(255) DEFAULT NULL,
  `REMOVED` int DEFAULT NULL,
  PRIMARY KEY (`SHOW_ID`),
  KEY `FK_SHOW_STATUS_ID` (`STATUS_ID`),
  KEY `FK_SHOW_CATEGORY_ID` (`CATEGORY_ID`),
  KEY `FK_SHOW_PUBLISHER_ID` (`PUBLISHER_ID`),
  KEY `FK_SHOW_AGE_RESTRICTION_ID` (`AGE_RESTRICTION_ID`),
  KEY `FK_SHOW_ADMIN_ID` (`ADMIN_ID`),
  CONSTRAINT `FK_SHOW_ADMIN_ID` FOREIGN KEY (`ADMIN_ID`) REFERENCES `CONTENT_ADMIN` (`ADMIN_ID`),
  CONSTRAINT `FK_SHOW_AGE_RESTRICTION_ID` FOREIGN KEY (`AGE_RESTRICTION_ID`) REFERENCES `AGE_RESTRICTION` (`AGE_RESTRICTION_ID`),
  CONSTRAINT `FK_SHOW_CATEGORY_ID` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `CATEGORY` (`CATEGORY_ID`),
  CONSTRAINT `FK_SHOW_PUBLISHER_ID` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `PUBLISHER` (`PUBLISHER_ID`),
  CONSTRAINT `FK_SHOW_STATUS_ID` FOREIGN KEY (`STATUS_ID`) REFERENCES `STATUS` (`STATUS_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOWS`
--

LOCK TABLES `SHOWS` WRITE;
/*!40000 ALTER TABLE `SHOWS` DISABLE KEYS */;
INSERT INTO `SHOWS` VALUES (1,1,1,1,3,'Avengers: Endgame','endgame_thumb.jpg','The epic conclusion to the Infinity Saga brings together all Marvel heroes for the ultimate battle against Thanos.','https://www.youtube.com/watch?v=TcMBFSGVi1c',10.00,'2019-04-26',1,'Marvel Studios',2,10,'endgame_banner.jpg',0),(2,1,1,2,3,'Dune: Part Two','dune2_thumb.jpg','Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.','https://www.youtube.com/watch?v=Way9Dexny3w',9.00,'2024-03-01',1,'Warner Bros Pictures',2,4,'dune2_banner.jpg',0),(3,1,1,3,4,'Deadpool & Wolverine','deadpool3_thumb.jpg','Deadpool teams up with Wolverine in this irreverent superhero adventure that breaks the fourth wall.','https://www.youtube.com/watch?v=73_1biulkYk',8.00,'2024-07-26',1,'Marvel Studios',2,2,'deadpool3_banner.jpg',0),(4,1,1,4,2,'Barbie','barbie_thumb.jpg','Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land.','https://www.youtube.com/watch?v=pBk4NYhWNMM',7.00,'2023-07-21',1,'Warner Bros Pictures',2,3,'barbie_banner.jpg',0),(5,1,1,1,3,'Spider-Man: No Way Home','spiderman_thumb.jpg','Peter Parker seeks help from Doctor Strange when his secret identity is revealed, but a spell gone wrong brings enemies from other dimensions.','https://www.youtube.com/watch?v=JfVOs4VSpmA',8.00,'2021-12-17',1,'Sony Pictures',2,3,'spiderman_banner.jpg',0),(6,1,1,5,4,'Oppenheimer','oppenheimer_thumb.jpg','The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.','https://www.youtube.com/watch?v=uYPbbksJxIg',8.00,'2023-07-21',1,'Universal Pictures',2,3,'oppenheimer_banner.jpg',0),(7,1,1,1,3,'Black Panther: Wakanda Forever','bp2_thumb.jpg','The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King TChalla.','https://www.youtube.com/watch?v=_Z3QKkl1WyM',7.00,'2022-11-11',1,'Marvel Studios',2,3,'bp2_banner.jpg',0),(8,1,1,6,4,'Nope','nope_thumb.jpg','The residents of a lonely gulch in inland California bear witness to an uncanny and chilling discovery.','https://www.youtube.com/watch?v=In8fuzj3gck',7.00,'2022-07-22',1,'Universal Pictures',2,2,'nope_banner.jpg',0),(9,1,1,2,3,'Dune','dune_thumb.jpg','Paul Atreides leads nomadic tribes in a revolt against the galactic emperor and his fathers nemesis, the Harkonnens.','https://www.youtube.com/watch?v=8g18jFHCLXk',8.00,'2021-10-22',1,'Warner Bros Pictures',2,2,'dune_banner.jpg',0),(10,1,1,6,3,'Everything Everywhere All at Once','eeaao_thumb.jpg','A middle-aged Chinese immigrant is swept up into an insane adventure where she alone can save existence.','https://www.youtube.com/watch?v=wxN1T1uxQ2g',8.00,'2022-03-25',1,'A24',2,3,'eeaao_banner.jpg',0),(11,1,2,6,3,'Stranger Things','stranger_thumb_s1.jpg','Season 1 of Stranger Things: Kids uncover a government secret and supernatural events in Hawkins.','https://www.youtube.com/watch?v=b9EkMc79ZSU',9.00,'2016-07-15',1,'Netflix Originals',2,0,'stranger_banner_s1.jpg',0),(12,1,2,6,3,'Stranger Things','stranger_thumb_s2.jpg','Season 2 of Stranger Things: The mystery deepens in Hawkins.','https://www.youtube.com/watch?v=b9EkMc79ZSU',9.00,'2017-10-27',2,'Netflix Originals',2,0,'stranger_banner_s2.jpg',0),(13,1,2,6,3,'Stranger Things','stranger_thumb_s3.jpg','Season 3 of Stranger Things: Battle escalates in the Upside Down.','https://www.youtube.com/watch?v=b9EkMc79ZSU',9.00,'2019-07-04',3,'Netflix Originals',2,0,'stranger_banner_s3.jpg',0),(14,1,2,2,4,'The Mandalorian','mandalorian_thumb_s1.jpg','Season 1 of The Mandalorian: A lone bounty hunter in the outer reaches of the galaxy.','https://www.youtube.com/watch?v=aOC8E8z_ifw',9.00,'2019-11-12',1,'Disney Studios',2,1,'mandalorian_banner_s1.jpg',0),(15,1,2,3,2,'The Office','office_thumb_s1.jpg','Season 1 of The Office: A mockumentary sitcom about a group of office employees.','https://www.youtube.com/watch?v=LHhbdXCzt_A',0.00,'2005-03-24',1,'Universal Pictures',2,0,'office_banner_s1.jpg',0),(16,1,2,4,2,'Brooklyn Nine-Nine','b99_thumb_s1.jpg','Season 1 of Brooklyn Nine-Nine: Detectives solve crimes and get into hilarious situations.','https://www.youtube.com/watch?v=sEaTd2d2Xe4',8.00,'2013-09-17',1,'Paramount Pictures',2,0,'b99_banner_s1.jpg',0),(17,1,2,5,6,'Breaking Bad','breaking_thumb_s1.jpg','Season 1 of Breaking Bad: A chemistry teacher turned drug kingpin.','https://www.youtube.com/watch?v=HhesaQXLuRY',0.00,'2008-01-20',1,'Sony Pictures',2,0,'breaking_banner_s1.jpg',0),(18,1,2,5,6,'Breaking Bad','breaking_thumb_s2.jpg','Season 2 of Breaking Bad: The descent into darkness begins.','https://www.youtube.com/watch?v=HhesaQXLuRY',0.00,'2009-03-07',2,'Sony Pictures',2,0,'breaking_banner_s2.jpg',0),(19,1,2,5,6,'Breaking Bad','breaking_thumb_s3.jpg','Season 3 of Breaking Bad: Tensions rise in the drug trade.','https://www.youtube.com/watch?v=HhesaQXLuRY',9.00,'2010-03-21',3,'Sony Pictures',2,0,'breaking_banner_s3.jpg',0),(20,1,2,6,6,'The Crown','crown_thumb_s1.jpg','Season 1 of The Crown: The political rivalries and romance of Queen Elizabeth II.','https://www.youtube.com/watch?v=JWtnJjn6ng0',9.00,'2016-11-04',1,'Netflix Originals',2,0,'crown_banner_s1.jpg',0),(21,1,2,1,4,'Peaky Blinders','peaky_thumb_s1.jpg','Season 1 of Peaky Blinders: A gangster family epic set in Birmingham, England.','https://www.youtube.com/watch?v=oVzVdvGIC7U',9.00,'2013-09-12',1,'Warner Bros Pictures',2,0,'peaky_banner_s1.jpg',0),(22,1,2,2,2,'WandaVision','wanda_thumb_s1.jpg','Season 1 of WandaVision: Two super-powered beings living suburban lives.','https://www.youtube.com/watch?v=sj9J2ecsSpo',8.00,'2021-01-15',1,'Disney Studios',2,0,'wanda_banner_s1.jpg',0),(23,1,2,3,6,'The Boys','boys_thumb_s1.jpg','Season 1 of The Boys: Vigilantes take down corrupt superheroes.','https://www.youtube.com/watch?v=06rueu_fh30',9.00,'2019-07-26',1,'Universal Pictures',2,0,'boys_banner_s1.jpg',0),(24,1,2,6,6,'The Witcher','witcher_thumb_s1.jpg','Season 1 of The Witcher: Geralt of Rivia fights monsters and destiny.','https://www.youtube.com/watch?v=ndl1W4ltcmg',8.00,'2019-12-20',1,'Netflix Originals',2,0,'witcher_banner_s1.jpg',0),(41,2,1,NULL,4,'Nomadland','Nomadland_THUMB.JPG','Nomadland is a 2020 American drama film written, produced, and directed by Chloé Zhao. It is based on the 2017 non-fiction book Nomadland: Surviving America in the Twenty-First Century by Jessica Bruder. The film stars Frances McDormand as a woman who leaves her small town to travel around the American West, living as a van-dwelling modern-day nomad.','https://www.youtube.com/embed/b_G5u0tW7b8',7.00,'2020-12-04',1,'Standard',2,0,'Nomadland_BANNER.JPG',0),(42,2,1,NULL,3,'CODA','CODA_THUMB.JPG','CODA is a 2021 American coming-of-age comedy-drama film directed and written by Sian Heder. It stars Emilia Jones, Eugenio Derbez, Troy Kotsur, and Marlee Matlin. The film follows a hearing teenage girl who is the only member of her family to hear, and who struggles to help her family’s fishing business while pursuing her own dreams as a singer.','https://www.youtube.com/embed/SeC8y06Nb6M',8.00,'2021-08-13',1,'Standard',2,0,'CODA_BANNER.JPG',0),(43,2,1,NULL,4,'Parasite','Parasite_THUMB.JPG','Parasite is a 2019 South Korean black comedy thriller film directed by Bong Joon-ho. The film follows the impoverished Kim family as they scheme to become employed by the wealthy Park family and infiltrate their household by posing as unrelated, highly qualified individuals.','https://www.youtube.com/embed/5xH0HfJHsaY',9.00,'2019-05-30',1,'Standard',2,0,'Parasite_BANNER.JPG',0),(44,2,1,NULL,4,'The Shape of Water','The_Shape_of_Water_THUMB.JPG','The Shape of Water is a 2017 American romantic fantasy drama film directed and co-written by Guillermo del Toro. The film stars Sally Hawkins as a mute janitor who falls in love with a captured humanoid amphibian creature in a high-security government laboratory during the Cold War era.','https://www.youtube.com/embed/XFYWazblaUA',7.00,'2017-12-01',1,'Standard',2,0,'The_Shape_of_Water_BANNER.JPG',0),(45,2,1,NULL,3,'Green Book','Green_Book_THUMB.JPG','Green Book is a 2018 American biographical comedy-drama film directed by Peter Farrelly. It tells the story of a tour of the Deep South in the 1960s by African-American classical and jazz pianist Don Shirley and his driver and bodyguard Tony Vallelonga.','https://www.youtube.com/embed/RctKVUeTqUo',8.00,'2018-11-16',1,'Standard',2,0,'Green_Book_BANNER.JPG',0),(46,2,1,NULL,3,'The Fabelmans','The_Fabelmans_THUMB.JPG','The Fabelmans is a 2022 American coming-of-age drama film directed by Steven Spielberg, who co-wrote the screenplay with Tony Kushner. The film is a semi-autobiographical story loosely based on Spielberg\'s adolescence and early years as a filmmaker.','https://www.youtube.com/embed/Sr2m3QQ1qtA',7.00,'2022-11-11',1,'Standard',2,0,'The_Fabelmans_BANNER.JPG',0),(47,2,1,NULL,4,'Tár','Tar_THUMB.JPG','Tár is a 2022 American psychological drama film written and directed by Todd Field. The film stars Cate Blanchett as Lydia Tár, a fictional world-renowned conductor and composer who experiences a professional and personal downfall.','https://www.youtube.com/embed/7aW_QsnjDEc',7.00,'2022-09-23',1,'Standard',2,0,'Tar_BANNER.JPG',0),(48,2,1,NULL,3,'West Side Story','West_Side_Story_THUMB.JPG','West Side Story is a 2021 American musical romantic drama film directed by Steven Spielberg, who co-wrote the screenplay with Tony Kushner. The film is an adaptation of the 1957 Broadway musical of the same name, which is inspired by William Shakespeare\'s play Romeo and Juliet.','https://www.youtube.com/embed/I-5NSPhk6Ps',8.00,'2021-12-10',1,'Standard',2,0,'West_Side_Story_BANNER.JPG',0),(49,2,1,NULL,4,'Moonlight','Moonlight_THUMB.JPG','Moonlight is a 2016 American coming-of-age drama film written and directed by Barry Jenkins. The film follows the life of a young black man named Chiron as he struggles to find his place in the world while growing up in a rough neighborhood of Miami.','https://www.youtube.com/embed/9NJj12tJzqc',7.00,'2016-10-21',1,'Standard',2,0,'Moonlight_BANNER.JPG',0),(50,2,1,NULL,4,'The Departed','The_Departed_THUMB.JPG','The Departed is a 2006 American crime thriller film directed by Martin Scorsese, who co-wrote the screenplay with William Monahan. It is a remake of the 2002 Hong Kong film Infernal Affairs. The film stars Leonardo DiCaprio, Matt Damon, Jack Nicholson, and Mark Wahlberg.','https://www.youtube.com/embed/auYbpnEwBBQ',9.00,'2006-10-06',1,'Standard',2,0,'The_Departed_BANNER.JPG',0),(51,2,1,NULL,4,'Joker','joker_thumb.jpg','Joker is a 2019 American psychological thriller film directed by Todd Phillips, who co-wrote the screenplay with Scott Silver.','https://www.youtube.com/watch?v=zAGVQLHvwOY',8.00,'2019-10-04',1,'standard',2,0,'joker_banner.jpg',0),(52,2,1,NULL,3,'Judy','judy_thumb.jpg','Judy is a 2019 biographical drama film based on the life of American entertainer Judy Garland, directed by Rupert Goold.','https://www.youtube.com/watch?v=zIt6m790Z7o',7.00,'2019-09-27',1,'standard',2,0,'judy_banner.jpg',0),(53,2,1,NULL,4,'1917','1917_thumb.jpg','1917 is a 2019 British war film directed by Sam Mendes and written by Mendes and Krysty Wilson‑Cairns; it follows two British soldiers on a dangerous mission during World War I.','https://www.youtube.com/watch?v=YqNYrYUiMfg',8.00,'2020-01-09',1,'standard',2,0,'1917_banner.jpg',0),(54,2,1,NULL,3,'Once Upon a Time in Hollywood','once_upon_a_time_in_hollywood_thumb.jpg','Once Upon a Time in Hollywood is a 2019 comedy‑drama film written and directed by Quentin Tarantino, featuring an ensemble cast led by Leonardo DiCaprio, Brad Pitt, and Margot Robbie.','https://www.youtube.com/watch?v=ELeMaP8EPAA',7.00,'2019-07-26',1,'standard',2,0,'once_upon_a_time_in_hollywood_banner.jpg',0),(55,2,1,NULL,2,'The Father','the_father_thumb.jpg','The Father is a 2020 drama film written and directed by Florian Zeller, adapted from his play and exploring dementia via Anthony Hopkins’s character.','https://www.youtube.com/watch?v=0GLVYF5roLc',8.00,'2021-06-11',1,'standard',2,0,'the_father_banner.jpg',0),(56,2,1,NULL,4,'Borat Subsequent Moviefilm','borat_subsequent_moviefilm_thumb.jpg','Borat Subsequent Moviefilm is a 2020 mockumentary comedy directed by Jason Woliner and starring Sacha Baron Cohen, in which Borat returns to the United States with his daughter.','https://www.youtube.com/watch?v=Y3kYQPfGP5I',7.00,'2020-10-23',1,'standard',2,0,'borat_subsequent_moviefilm_banner.jpg',0),(57,2,1,NULL,3,'Ma Rainey’s Black Bottom','ma_raineys_black_bottom_thumb.jpg','Ma Rainey’s Black Bottom is a 2020 American drama film directed by George C. Wolfe, based on August Wilson’s 1984 play of the same name.','https://www.youtube.com/watch?v=y1jOpSK5OPQ',7.00,'2020-12-18',1,'standard',2,0,'ma_raineys_black_bottom_banner.jpg',0),(58,2,1,NULL,3,'After Love','after_love_thumb.jpg','After Love is a 2020 drama film written and directed by Aleem Khan, following a woman who uncovers secrets about her late husband.','https://www.youtube.com/watch?v=XXXXXXX',10.00,'2021-05-28',1,'standard',2,0,'after_love_banner.jpg',0),(59,2,1,NULL,4,'The United States vs. Billie Holiday','59_thumb_1753176947840.jpg','The United States vs. Billie Holiday is a 2021 American biographical drama film directed by Lee Daniels, exploring the singer’s life amid legal persecution.','https://www.youtube.com/watch?v=abcdefg',8.50,'2021-02-20',1,'standard',2,0,'59_banner_1753176792868.jpg',0),(60,2,1,NULL,3,'The Eyes of Tammy Faye','the_eyes_of_tammy_faye_thumb.jpg','The Eyes of Tammy Faye is a 2021 biographical drama film directed by Michael Showalter, chronicling the rise and fall of televangelists Tammy Faye and Jim Bakker.','https://www.youtube.com/watch?v=hijklmn',7.00,'2021-09-17',1,'standard',2,0,'the_eyes_of_tammy_faye_banner.jpg',0),(61,2,1,NULL,3,'The Power of the Dog','the_power_of_the_dog_thumb.jpg','The Power of the Dog is a 2021 revisionist Western drama film directed by Jane Campion, adapted from Thomas Savage’s novel of the same name.','https://www.youtube.com/watch?v=opqrstu',0.00,'2021-11-17',1,'standard',2,0,'the_power_of_the_dog_banner.jpg',0),(62,2,1,NULL,2,'King Richard','king_richard_thumb.jpg','King Richard is a 2021 American biographical sports drama film directed by Reinaldo Marcus Green, focusing on Richard Williams and the upbringing of Venus and Serena Williams.','https://www.youtube.com/watch?v=vwxyzab',7.00,'2021-11-19',1,'standard',2,0,'king_richard_banner.jpg',0),(63,2,1,NULL,3,'Being the Ricardos','being_the_ricardos_thumb.jpg','Being the Ricardos is a 2021 biographical drama film written and directed by Aaron Sorkin, portraying the personal and professional challenges of Lucille Ball and Desi Arnaz.','https://www.youtube.com/watch?v=cdefghi',7.00,'2021-12-10',1,'standard',2,0,'being_the_ricardos_banner.jpg',0),(64,2,1,NULL,4,'All Quiet on the Western Front','all_quiet_on_the_western_front_thumb.jpg','All Quiet on the Western Front is a 2022 German epic anti‑war film directed by Edward Berger, adapted from Erich Maria Remarque’s novel.','https://www.youtube.com/watch?v=qrstuvwx',8.00,'2022-10-07',1,'standard',2,0,'all_quiet_on_the_western_front_banner.jpg',0),(65,2,1,NULL,4,'Elvis','elvis_thumb.jpg','Elvis is a 2022 biographical musical film directed by Baz Luhrmann, exploring the life of rock and roll icon Elvis Presley.','https://www.youtube.com/watch?v=yzabcdef',7.00,'2022-06-24',1,'standard',2,0,'elvis_banner.jpg',0),(66,2,1,NULL,3,'The Banshees of Inisherin','the_banshees_of_inisherin_thumb.jpg','The Banshees of Inisherin is a 2022 black comedy drama film written and directed by Martin McDonagh, set on a remote Irish island.','https://www.youtube.com/watch?v=bcdefghi',7.00,'2022-10-21',1,'standard',2,0,'the_banshees_of_inisherin_banner.jpg',0),(67,2,1,NULL,4,'Poor Things','poor_things_thumb.jpg','Poor Things is a 2023 adventure fantasy comedy drama directed by Yorgos Lanthimos, loosely based on the novel by Alasdair Gray.','https://www.youtube.com/watch?v=cdefghij',7.00,'2023-12-08',1,'standard',2,0,'poor_things_banner.jpg',0),(68,2,1,NULL,4,'Killers of the Flower Moon','killers_of_the_flower_moon_thumb.jpg','Killers of the Flower Moon is a 2023 American epic Western crime drama film directed by Martin Scorsese, based on David Grann’s book.','https://www.youtube.com/watch?v=defghijk',8.00,'2023-10-20',1,'standard',2,0,'killers_of_the_flower_moon_banner.jpg',0),(69,2,1,NULL,4,'The Holdovers','the_holdovers_thumb.jpg','The Holdovers is a 2023 American historical comedy‑drama film directed by Alexander Payne, set at a boys’ boarding school during Christmas 1970.','https://www.youtube.com/watch?v=efghijkl',7.00,'2023-10-27',1,'standard',2,0,'the_holdovers_banner.jpg',0);
/*!40000 ALTER TABLE `SHOWS` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_insert_royalty_on_watch_update` AFTER UPDATE ON `SHOWS` FOR EACH ROW BEGIN
  IF NEW.WATCH_COUNT <> OLD.WATCH_COUNT THEN
    INSERT INTO PUBLISHER_EARNINGS (
      PUBLISHER_ID,
      EARNING_TYPE,
      AMOUNT,
      PAID_DATE
    )
    SELECT
      NEW.PUBLISHER_ID,
      'ROYALTY',
      p.ROYALTY,
      CURDATE()
    FROM PUBLISHER p
    WHERE p.PUBLISHER_ID = NEW.PUBLISHER_ID;
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `SHOW_AWARD`
--

DROP TABLE IF EXISTS `SHOW_AWARD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOW_AWARD` (
  `SHOW_ID` int NOT NULL,
  `AWARD_ID` int NOT NULL,
  `YEAR` int DEFAULT NULL,
  PRIMARY KEY (`SHOW_ID`,`AWARD_ID`),
  KEY `FK_SHOW_AWARD_AWARD_ID` (`AWARD_ID`),
  CONSTRAINT `FK_SHOW_AWARD_AWARD_ID` FOREIGN KEY (`AWARD_ID`) REFERENCES `AWARD` (`AWARD_ID`),
  CONSTRAINT `FK_SHOW_AWARD_SHOW_ID` FOREIGN KEY (`SHOW_ID`) REFERENCES `SHOWS` (`SHOW_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOW_AWARD`
--

LOCK TABLES `SHOW_AWARD` WRITE;
/*!40000 ALTER TABLE `SHOW_AWARD` DISABLE KEYS */;
INSERT INTO `SHOW_AWARD` VALUES (1,7,2019),(1,8,2019),(2,1,2024),(2,2,2024),(2,3,2024),(4,6,2023),(4,7,2023),(5,7,2022),(5,8,2022),(6,1,2023),(6,2,2023),(6,3,2024),(8,9,2022),(9,9,2021),(10,1,2023),(10,2,2023),(10,4,2023),(41,1,2021),(41,2,2021),(41,3,2021),(41,4,2021),(41,5,2021),(42,1,2022),(42,2,2022),(42,3,2022),(42,4,2022),(42,5,2022),(43,1,2020),(43,2,2020),(43,3,2020),(43,4,2020),(43,5,2020),(44,1,2018),(44,2,2018),(44,3,2018),(44,5,2018),(45,1,2019),(45,2,2019),(45,3,2019),(45,5,2019),(46,2,2023),(46,5,2023),(47,1,2023),(47,2,2023),(48,1,2022),(48,2,2022),(48,3,2022),(49,1,2017),(49,2,2017),(49,3,2017),(49,5,2017),(50,1,2007),(50,2,2007),(50,3,2007),(50,5,2007);
/*!40000 ALTER TABLE `SHOW_AWARD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOW_CAST`
--

DROP TABLE IF EXISTS `SHOW_CAST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOW_CAST` (
  `SHOW_ID` int NOT NULL,
  `ACTOR_ID` int NOT NULL,
  `ROLE_NAME` varchar(50) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`SHOW_ID`,`ACTOR_ID`),
  KEY `FK_SHOW_CAST_ACTOR_ID` (`ACTOR_ID`),
  CONSTRAINT `FK_SHOW_CAST_ACTOR_ID` FOREIGN KEY (`ACTOR_ID`) REFERENCES `ACTOR` (`ACTOR_ID`),
  CONSTRAINT `FK_SHOW_CAST_SHOW_ID` FOREIGN KEY (`SHOW_ID`) REFERENCES `SHOWS` (`SHOW_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOW_CAST`
--

LOCK TABLES `SHOW_CAST` WRITE;
/*!40000 ALTER TABLE `SHOW_CAST` DISABLE KEYS */;
INSERT INTO `SHOW_CAST` VALUES (1,1,'Tony Stark / Iron Man','Genius billionaire and founding Avenger who sacrifices himself to defeat Thanos.'),(1,2,'Natasha Romanoff / Black Widow','Spy and assassin who sacrifices herself for the Soul Stone.'),(1,3,'Steve Rogers / Captain America','Super soldier who leads the Avengers and returns the Infinity Stones.'),(1,4,'Bruce Banner / Hulk','Scientist with a powerful alter ego; merges intellect and strength.'),(1,5,'Thor','God of Thunder struggling with guilt; joins the time heist.'),(1,6,'Clint Barton / Hawkeye','Master archer turned vigilante Ronin after the Blip.'),(1,11,'Scott Lang / Ant-Man','Ex-con who proposes time travel with quantum tech.'),(1,12,'Carol Danvers / Captain Marvel','Cosmic-powered hero who aids the Avengers in the final battle.'),(1,13,'T’Challa / Black Panther','King of Wakanda, appears during the final battle via portal.'),(1,16,'Okoye','Wakandan warrior and loyal general of the Dora Milaje.'),(2,8,'Chani','Fremen warrior and love interest of Paul; skeptical of prophecy.'),(2,22,'Paul Atreides','Heir to House Atreides; destined messiah of the Fremen.'),(3,17,'Wade Wilson / Deadpool','Regenerating mercenary with a foul mouth and fourth-wall awareness.'),(3,18,'Logan / Wolverine','Mutant with healing powers and claws; returns from another timeline.'),(4,20,'Ken','Devoted to Barbie but struggles with self-identity in patriarchy.'),(4,21,'Barbie','Stereotypical Barbie who begins to question her world.'),(5,7,'Peter Parker / Spider-Man','Teenage superhero whose identity is exposed and seeks help from Strange.'),(5,8,'MJ (Michelle Jones-Watson)','Peter’s girlfriend; smart, grounded, and loyal.'),(5,9,'Dr. Stephen Strange','Master of the Mystic Arts who casts a memory-altering spell.'),(6,1,'Lewis Strauss','Atomic Energy Commission chairman'),(6,45,'Leslie Groves','Director of the Manhattan Project'),(6,46,'J. Robert Oppenheimer','Theoretical physicist and “father of the atomic bomb” during the Manhattan Project.'),(6,47,'Kitty Oppenheimer','Oppenheimer’s wife'),(7,14,'Erik Killmonger','Former enemy who appears in the ancestral plane.'),(7,15,'Nakia','Wakandan spy and former lover of T’Challa.'),(7,16,'Okoye','General of the Dora Milaje; struggles with her role post-T’Challa.'),(8,49,'Emerald Haywood','Psychic horse trainer'),(8,50,'Otis “OJ” Haywood Jr.','Emerald’s brother and assistant'),(9,8,'Chani','Fremen warrior and Paul’s love interest'),(9,22,'Paul Atreides','Young noble destined to change the future of Arrakis.'),(9,24,'Duke Leto Atreides','Paul’s father'),(9,51,'Lady Jessica','Paul’s mother'),(10,52,'Joy Wang / Jobu Tupaki','Evelyn’s daughter and antagonist'),(10,53,'Waymond Wang','Evelyn’s husband'),(11,54,'Joyce Byers','Mother searching for her son'),(11,55,'Jim Hopper','Hawkins Police Chief'),(12,54,'Joyce Byers','Mother searching for her son (Continued)'),(12,55,'Jim Hopper','Hawkins Police Chief (Continued)'),(13,54,'Joyce Byers','Mother searching for her son (Continued)'),(13,55,'Jim Hopper','Hawkins Police Chief (Continued)'),(14,56,'Din Djarin','Lone bounty hunter'),(14,57,'Cara Dune','Former Rebel trooper'),(15,58,'Michael Scott','Regional Manager'),(15,59,'Dwight Schrute','Assistant Regional Manager'),(16,60,'Jake Peralta','Detective'),(16,61,'Terry Jeffords','Sergeant'),(17,62,'Walter White','Chemistry teacher turned meth producer'),(17,63,'Jesse Pinkman','Walter’s partner'),(18,62,'Walter White','Chemistry teacher turned meth producer (Continued)'),(18,63,'Jesse Pinkman','Walter’s partner (Continued)'),(19,62,'Walter White','Chemistry teacher turned meth producer (Continued)'),(19,63,'Jesse Pinkman','Walter’s partner (Continued)'),(20,64,'Queen Elizabeth II','Young Queen Elizabeth'),(20,65,'Prince Philip','Queen’s husband'),(21,46,'Tommy Shelby','Leader of the Peaky Blinders gang; a cunning and ambitious man.'),(21,66,'Polly Gray','Shelby family matriarch'),(22,10,'Wanda Maximoff / Scarlet Witch','A powerful sorceress struggling to control her reality-altering powers while coping with loss.'),(22,67,'Vision','Android and Wanda’s love interest'),(23,68,'Billy Butcher','Vigilante group leader'),(23,69,'Hughie Campbell','New member'),(24,70,'Geralt of Rivia','Monster hunter'),(24,71,'Yennefer of Vengerberg','Powerful sorceress'),(41,26,'Fern','A woman who leaves her small town to travel around the American West as a modern-day nomad.'),(41,27,'Dave','A friend Fern meets while living on the road.'),(42,28,'Ruby Rossi','The only hearing member of a deaf family who dreams of becoming a singer.'),(42,29,'Frank Rossi','Ruby’s father, a deaf fisherman.'),(43,30,'Kim Ki-taek','The patriarch of the impoverished Kim family.'),(43,31,'Park Dong-ik','The wealthy father of the Park family.'),(44,32,'Elisa Esposito','A mute janitor who forms a relationship with an amphibious creature.'),(44,33,'Richard Strickland','A government agent and Elisa’s antagonist.'),(45,34,'Tony Lip','A bouncer who becomes the driver for Don Shirley.'),(45,35,'Dr. Don Shirley','An African-American classical and jazz pianist.'),(46,36,'Sammy Fabelman','A young aspiring filmmaker.'),(46,37,'Mitzi Fabelman','Sammy’s supportive mother.'),(47,38,'Lydia Tár','A renowned conductor facing professional and personal challenges.'),(47,39,'Franziska Vogt','Lydia’s protegée and assistant.'),(48,40,'Tony','A former member of the Jets gang who falls in love with Maria.'),(48,41,'Maria','The sister of Bernardo and love interest of Tony.'),(49,42,'Chiron','A young man growing up in a rough Miami neighborhood.'),(49,43,'Kevin','Chiron’s childhood friend and love interest.'),(50,44,'Billy Costigan','An undercover cop infiltrating the mob.'),(50,45,'Colin Sullivan','A mole in the police working for the mob.'),(51,72,'Arthur Fleck / Joker','A troubled comedian who descends into madness and becomes the Joker.'),(52,85,'Judy Garland','Iconic actress and singer facing struggles in her later career.'),(53,9,'Colonel Mackenzie','A strict British Army officer leading a mission during WWI.'),(54,21,'Sharon Tate','Rising actress and wife of Roman Polanski.'),(54,44,'Rick Dalton','An aging TV actor navigating Hollywood in the late 1960s.'),(54,76,'Elvis Presley','Legendary rock and roll singer and cultural icon.'),(55,73,'Anthony','An elderly man dealing with dementia and his relationship with his daughter.'),(57,13,'Levee Green','A charismatic and ambitious trumpeter in a 1920s blues band.'),(58,88,'Mary','A woman grappling with grief and secrets after her husband\'s death.'),(59,86,'Billie Holiday','Renowned jazz singer fighting racism and addiction.'),(60,87,'Tammy Faye Bakker','Television evangelist known for her eccentric personality and faith.'),(62,75,'Richard Williams','Determined father coaching his daughters to tennis greatness.'),(63,89,'Lucille Ball','Comedic genius and star of I Love Lucy.'),(65,76,'Elvis Presley','Legendary rock and roll singer and cultural icon.'),(66,77,'Pádraic Súilleabháin','Lonely farmer facing the sudden end of a friendship.'),(67,4,'Godfrey Baxter','Bella\'s caring husband.'),(67,19,'Bella Baxter','A woman brought back to life with a curious new nature.'),(68,44,'Ernest Burkhart','Man entangled in the Osage murders and family drama.'),(68,92,'Mollie Burkhart','Ernest\'s Osage wife caught in the tragic events.'),(69,78,'Paul Hunham','A curmudgeonly teacher trying to connect with students.'),(69,93,'Dotty','School cook with a strong personality.');
/*!40000 ALTER TABLE `SHOW_CAST` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOW_DIRECTOR`
--

DROP TABLE IF EXISTS `SHOW_DIRECTOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOW_DIRECTOR` (
  `SHOW_ID` int NOT NULL,
  `DIRECTOR_ID` int NOT NULL,
  PRIMARY KEY (`SHOW_ID`,`DIRECTOR_ID`),
  KEY `FK_SHOW_DIRECTOR_DIRECTOR_ID` (`DIRECTOR_ID`),
  CONSTRAINT `FK_SHOW_DIRECTOR_DIRECTOR_ID` FOREIGN KEY (`DIRECTOR_ID`) REFERENCES `DIRECTOR` (`DIRECTOR_ID`),
  CONSTRAINT `FK_SHOW_DIRECTOR_SHOW_ID` FOREIGN KEY (`SHOW_ID`) REFERENCES `SHOWS` (`SHOW_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOW_DIRECTOR`
--

LOCK TABLES `SHOW_DIRECTOR` WRITE;
/*!40000 ALTER TABLE `SHOW_DIRECTOR` DISABLE KEYS */;
INSERT INTO `SHOW_DIRECTOR` VALUES (6,1),(46,2),(48,2),(50,3),(68,3),(54,4),(2,5),(9,5),(7,6),(4,7),(8,8),(41,9),(1,12),(1,13),(3,15),(42,18),(43,19),(44,20),(45,21),(47,23),(49,24),(53,26),(61,27),(55,30),(64,30),(51,31),(52,32),(56,33),(57,34),(58,35),(59,36),(60,37),(62,38),(63,39),(65,40),(66,41),(67,42),(69,43);
/*!40000 ALTER TABLE `SHOW_DIRECTOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOW_EPISODE`
--

DROP TABLE IF EXISTS `SHOW_EPISODE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOW_EPISODE` (
  `SHOW_EPISODE_ID` int NOT NULL AUTO_INCREMENT,
  `SHOW_ID` int DEFAULT NULL,
  `EPISODE_NUMBER` int DEFAULT NULL,
  `SHOW_EPISODE_TITLE` varchar(50) DEFAULT NULL,
  `SHOW_EPISODE_DURATION` int DEFAULT NULL,
  `SHOW_EPISODE_RELEASE_DATE` date DEFAULT NULL,
  `SHOW_EPISODE_DESCRIPTION` varchar(500) DEFAULT NULL,
  `VIDEO_URL` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`SHOW_EPISODE_ID`),
  KEY `FK_SHOW_SHOW_EPISODE_ID` (`SHOW_ID`),
  CONSTRAINT `FK_SHOW_SHOW_EPISODE_ID` FOREIGN KEY (`SHOW_ID`) REFERENCES `SHOWS` (`SHOW_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOW_EPISODE`
--

LOCK TABLES `SHOW_EPISODE` WRITE;
/*!40000 ALTER TABLE `SHOW_EPISODE` DISABLE KEYS */;
INSERT INTO `SHOW_EPISODE` VALUES (1,1,1,'Full Movie',181,'2019-04-26','The complete Avengers: Endgame movie','avengers_endgame.mp4'),(2,2,1,'Full Movie',166,'2024-03-01','The complete Dune: Part Two movie','https://demo.com/videos/dune_part_two.mp4'),(3,3,1,'Full Movie',127,'2024-07-26','The complete Deadpool & Wolverine movie','https://demo.com/videos/deadpool_wolverine.mp4'),(4,4,1,'Full Movie',114,'2023-07-21','The complete Barbie movie','https://demo.com/videos/barbie.mp4'),(5,5,1,'Full Movie',148,'2021-12-17','The complete Spider-Man: No Way Home movie','https://demo.com/videos/spiderman_no_way_home.mp4'),(6,6,1,'Full Movie',180,'2023-07-21','The complete Oppenheimer movie','https://demo.com/videos/oppenheimer.mp4'),(7,7,1,'Full Movie',161,'2022-11-11','The complete Black Panther: Wakanda Forever movie','https://demo.com/videos/black_panther_wakanda_forever.mp4'),(8,8,1,'Full Movie',130,'2022-07-22','The complete Nope movie','https://demo.com/videos/nope.mp4'),(9,9,1,'Full Movie',155,'2021-10-22','The complete Dune movie','https://demo.com/videos/dune.mp4'),(10,10,1,'Full Movie',139,'2022-03-25','The complete Everything Everywhere All at Once movie','https://demo.com/videos/everything_everywhere.mp4'),(11,11,1,'The Vanishing of Will Byers',47,'2016-07-15','Will goes missing after a D&D night.','https://demo.com/videos/stranger_things_s1e1.mp4'),(12,11,2,'The Weirdo on Maple Street',55,'2016-07-15','Mike hides Eleven.','https://demo.com/videos/stranger_things_s1e2.mp4'),(13,14,1,'Chapter 1: The Mandalorian',39,'2019-11-12','Mando gets a mysterious bounty.','https://demo.com/videos/mandalorian_s1e1.mp4'),(14,14,2,'Chapter 2: The Child',33,'2019-11-15','Mando protects The Child.','https://demo.com/videos/mandalorian_s1e2.mp4'),(15,15,1,'Pilot',23,'2005-03-24','Meet the Dunder Mifflin team.','https://demo.com/videos/office_s1e1.mp4'),(16,15,2,'Diversity Day',22,'2005-03-29','Michael holds sensitivity training.','https://demo.com/videos/office_s1e2.mp4'),(17,16,1,'Pilot',22,'2013-09-17','Jake Peralta gets a new captain.','https://demo.com/videos/brooklyn99_s1e1.mp4'),(18,16,2,'The Tagger',21,'2013-09-24','Peralta pursues a tagger.','https://demo.com/videos/brooklyn99_s1e2.mp4'),(19,17,1,'Pilot',58,'2008-01-20','Walter White starts cooking meth.','https://demo.com/videos/breakingbad_s1e1.mp4'),(20,17,2,'Cat’s in the Bag...',48,'2008-01-27','Walter and Jesse clean up. damn','https://demo.com/videos/breakingbad_s1e2.mp4'),(21,20,1,'Wolferton Splash',61,'2016-11-04','Elizabeth and Philip marry.','https://demo.com/videos/crown_s1e1.mp4'),(22,20,2,'Hyde Park Corner',56,'2016-11-04','King George dies.','https://demo.com/videos/crown_s1e2.mp4'),(23,21,1,'Episode 1',58,'2013-09-12','Thomas Shelby sets his sights high.','https://demo.com/videos/peaky_s1e1.mp4'),(24,21,2,'Episode 2',59,'2013-09-19','Shelbys face new threats.','https://demo.com/videos/peaky_s1e2.mp4'),(25,22,1,'Filmed Before a Live Studio Audience',30,'2021-01-15','Wanda and Vision settle in.','https://demo.com/videos/wandavision_s1e1.mp4'),(26,22,2,'Don’t Touch That Dial',35,'2021-01-15','A magic show mishap.','https://demo.com/videos/wandavision_s1e2.mp4'),(27,23,1,'The Name of the Game',61,'2019-07-26','A-Train kills Hughie’s girlfriend.','https://demo.com/videos/theboys_s1e1.mp4'),(28,23,2,'Cherry',59,'2019-07-26','The Boys get deeper.','https://demo.com/videos/theboys_s1e2.mp4'),(29,24,1,'The End’s Beginning',61,'2019-12-20','Geralt slays a monster.','https://demo.com/videos/witcher_s1e1.mp4'),(30,24,2,'Four Marks',60,'2019-12-20','Ciri and Yennefer introduced.','https://demo.com/videos/witcher_s1e2.mp4'),(31,12,1,'MADMAX',48,'2017-10-27','A new girl shakes up Hawkins.','https://demo.com/videos/stranger_things_s2e1.mp4'),(32,12,2,'Trick or Treat, Freak',50,'2017-10-27','The kids go trick or treating.','https://demo.com/videos/stranger_things_s2e2.mp4'),(33,13,1,'Suzie, Do You Copy?',51,'2019-07-04','Strange transmissions are heard.','https://demo.com/videos/stranger_things_s3e1.mp4'),(34,13,2,'The Mall Rats',50,'2019-07-04','Rats behave bizarrely in Hawkins.','https://demo.com/videos/stranger_things_s3e2.mp4'),(35,18,1,'Seven Thirty-Seven',47,'2009-03-08','Walter and Jesse face Tuco.','https://demo.com/videos/breakingbad_s2e1.mp4'),(36,18,2,'Grilled',48,'2009-03-15','Kidnapped by Tuco.','https://demo.com/videos/breakingbad_s2e2.mp4'),(37,19,1,'No Más',48,'2010-03-21','Walter struggles with the aftermath.','https://demo.com/videos/breakingbad_s3e1.mp4'),(38,19,2,'Caballo Sin Nombre',47,'2010-03-28','Walter sings and fights.','https://demo.com/videos/breakingbad_s3e2.mp4'),(39,41,1,'Full Movie',108,'2020-12-04','The complete Nomadland Movie','https://demo.video.url/nomadland'),(40,42,1,'Full Movie',111,'2021-08-13','The complete CODA Movie','https://demo.video.url/coda'),(41,43,1,'Full Movie',132,'2019-05-30','The complete Parasite Movie','https://demo.video.url/parasite'),(42,44,1,'Full Movie',123,'2017-12-01','The complete The Shape of Water Movie','https://demo.video.url/shapeofwater'),(43,45,1,'Full Movie',130,'2018-11-16','The complete Green Book Movie','https://demo.video.url/greenbook'),(44,46,1,'Full Movie',151,'2022-11-11','The complete The Fabelmans Movie','https://demo.video.url/fabelmans'),(45,47,1,'Full Movie',158,'2022-09-23','The complete Tár Movie','https://demo.video.url/tar'),(46,48,1,'Full Movie',156,'2021-12-10','The complete West Side Story Movie','https://demo.video.url/westsidestory'),(47,49,1,'Full Movie',111,'2016-10-21','The complete Moonlight Movie','https://demo.video.url/moonlight'),(48,50,1,'Full Movie',151,'2006-10-06','The complete The Departed Movie','https://demo.video.url/departed'),(49,51,1,'Joker Full Movie',122,'2019-10-04','A failed comedian descends into madness and becomes the infamous Joker.','https://example.com/joker-full-movie'),(50,52,1,'Judy Full Movie',118,'2019-10-02','The story of Judy Garland\'s final concerts in London in 1968.','https://example.com/judy-full-movie'),(51,53,1,'1917 Full Movie',119,'2019-12-25','Two British soldiers are tasked with delivering a message to save 1,600 men during WWI.','https://example.com/1917-full-movie'),(52,54,1,'Once Upon a Time in Hollywood Full Movie',159,'2019-07-26','A faded TV actor and his stunt double strive to achieve fame and success in the final years of Hollywood\'s Golden Age.','https://example.com/once-upon-a-time-in-hollywood-full-movie'),(53,55,1,'The Father Full Movie',97,'2020-12-18','A man refuses all assistance from his daughter as he ages, but the truth is hard to discern.','https://example.com/the-father-full-movie'),(54,56,1,'Borat Subsequent Moviefilm Full Movie',96,'2020-10-23','Kazakh TV talking head Borat is dispatched to the United States to offer his daughter as a gift to the then-Vice President.','https://example.com/borat-subsequent-moviefilm-full-movie'),(55,57,1,'Ma Rainey’s Black Bottom Full Movie',94,'2020-11-25','Tensions rise when trailblazing blues singer Ma Rainey and her band gather at a recording studio in Chicago in 1927.','https://example.com/ma-raineys-black-bottom-full-movie'),(56,58,1,'After Love Full Movie',90,'2021-06-04','Mary Hussain, a Muslim convert, discovers that her late husband had a secret family in France.','https://example.com/after-love-full-movie'),(57,59,1,'The United States vs. Billie Holiday Full Movie',130,'2021-02-26','Billie Holiday is targeted by the Federal Department of Narcotics with an undercover sting operation led by black federal agent Jimmy Fletcher.','https://example.com/the-united-states-vs-billie-holiday-full-movie'),(58,60,1,'The Eyes of Tammy Faye Full Movie',126,'2021-09-17','An intimate look at the extraordinary rise, fall and redemption of televangelist Tammy Faye Bakker.','https://example.com/the-eyes-of-tammy-faye-full-movie'),(59,61,1,'The Power of the Dog Full Movie',128,'2021-11-17','A domineering rancher responds with mocking cruelty when his brother brings home a new wife and her son, until the unexpected comes to pass.','https://example.com/the-power-of-the-dog-full-movie'),(60,62,1,'King Richard Full Movie',145,'2021-11-19','A look at how tennis superstars Venus and Serena Williams became who they are after the coaching from their father Richard Williams.','https://example.com/king-richard-full-movie'),(61,63,1,'Being the Ricardos Full Movie',130,'2021-12-21','Follows Lucy and Desi as they face a crisis that could end their careers and another that could end their marriage.','https://example.com/being-the-ricardos-full-movie'),(62,64,1,'All Quiet on the Western Front Full Movie',147,'2022-10-14','A young German soldier’s terrifying experiences and distress on the western front during World War I.','https://example.com/all-quiet-on-the-western-front-full-movie'),(63,65,1,'Elvis Full Movie',159,'2022-06-24','The life story of Elvis Presley as seen through the complicated relationship with his enigmatic manager, Colonel Tom Parker.','https://example.com/elvis-full-movie'),(64,66,1,'The Banshees of Inisherin Full Movie',114,'2022-10-21','Two lifelong friends find themselves at an impasse when one abruptly ends their relationship, with alarming consequences for both.','https://example.com/the-banshees-of-inisherin-full-movie'),(65,67,1,'Poor Things Full Movie',141,'2023-09-08','A young woman, who is brought back to life by an eccentric and unorthodox scientist, embarks on an adventurous journey.','https://example.com/poor-things-full-movie'),(66,68,1,'Killers of the Flower Moon Full Movie',206,'2023-10-20','In 1920s Oklahoma, members of the Osage Nation are murdered under mysterious circumstances, sparking a major FBI investigation.','https://example.com/killers-of-the-flower-moon-full-movie'),(67,69,1,'The Holdovers Full Movie',113,'2023-10-27','A cranky history teacher at a prep school is forced to remain on campus over the holidays with a cook and a troubled student who has no place to go.','https://example.com/the-holdovers-full-movie'),(70,17,3,'check',NULL,'2025-07-18','check',NULL),(71,17,4,'check',NULL,'2025-07-18','check',NULL),(72,17,5,'check',NULL,'2025-07-18','check',NULL),(73,17,6,'check',NULL,'2025-07-18','check',NULL),(74,17,7,'check',NULL,'2025-07-18','check',NULL);
/*!40000 ALTER TABLE `SHOW_EPISODE` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `tr_new_episode_notification` AFTER INSERT ON `SHOW_EPISODE` FOR EACH ROW BEGIN
    DECLARE new_notif_id BIGINT;
    DECLARE show_title VARCHAR(255);
    DECLARE season_number INT;
    DECLARE category_id INT;
    DECLARE notification_message VARCHAR(255);
    
    -- Get the show title, season, and category for the notification message
    SELECT TITLE, SEASON, CATEGORY_ID INTO show_title, season_number, category_id
    FROM SHOWS
    WHERE SHOW_ID = NEW.SHOW_ID;
    
    -- Create the notification message based on category
    IF category_id = 1 THEN
        -- Movie message
        SET notification_message = CONCAT('New movie "', show_title, '" just dropped!');
    ELSE
        -- TV Show message with season
        SET notification_message = CONCAT('New episode "', NEW.SHOW_EPISODE_TITLE, '" available for ', show_title, ' Season ', COALESCE(season_number, 1));
    END IF;
    
    -- Insert the notification into NOTIFICATIONS table
    INSERT INTO NOTIFICATIONS (MESSAGE, TYPE, DATA)
    VALUES (
        notification_message,
        'movie_update',
        IF(category_id = 1,
            JSON_OBJECT(
                'movie_id', NEW.SHOW_ID,
                'show_title', show_title
            ),
            JSON_OBJECT(
                'movie_id', NEW.SHOW_ID,
                'show_title', CONCAT(show_title, ' Season ', COALESCE(season_number, 1))
            )
        )
    );
    
    -- Get the ID of the newly created notification
    SET new_notif_id = LAST_INSERT_ID();
    
    -- Insert notification for all users using a simple INSERT...SELECT
    INSERT INTO USER_NOTIFICATIONS (USER_ID, NOTIF_ID, IS_READ)
    SELECT CAST(USER_ID AS UNSIGNED), new_notif_id, FALSE
    FROM USER
    WHERE USER_ID IS NOT NULL;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `SHOW_EPISODE_CAST`
--

DROP TABLE IF EXISTS `SHOW_EPISODE_CAST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOW_EPISODE_CAST` (
  `ACTOR_ID` int NOT NULL,
  `SHOW_EPISODE_ID` int NOT NULL,
  PRIMARY KEY (`ACTOR_ID`,`SHOW_EPISODE_ID`),
  KEY `FK_SHOW_EPISODE_CAST_SHOW_EPISODE_ID` (`SHOW_EPISODE_ID`),
  CONSTRAINT `FK_SHOW_EPISODE_CAST_ACTOR_ID` FOREIGN KEY (`ACTOR_ID`) REFERENCES `ACTOR` (`ACTOR_ID`),
  CONSTRAINT `FK_SHOW_EPISODE_CAST_SHOW_EPISODE_ID` FOREIGN KEY (`SHOW_EPISODE_ID`) REFERENCES `SHOW_EPISODE` (`SHOW_EPISODE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOW_EPISODE_CAST`
--

LOCK TABLES `SHOW_EPISODE_CAST` WRITE;
/*!40000 ALTER TABLE `SHOW_EPISODE_CAST` DISABLE KEYS */;
INSERT INTO `SHOW_EPISODE_CAST` VALUES (1,1),(2,1),(3,2),(4,2),(5,3),(6,3),(7,4),(9,5),(8,6),(10,6),(11,11),(12,11),(13,13),(14,15),(15,17),(16,19),(17,19),(18,21),(6,25),(7,25),(6,26),(7,26),(8,27),(9,27),(8,28),(9,28),(10,29),(11,29),(20,29),(10,30),(11,30);
/*!40000 ALTER TABLE `SHOW_EPISODE_CAST` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOW_EPISODE_DIRECTOR`
--

DROP TABLE IF EXISTS `SHOW_EPISODE_DIRECTOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOW_EPISODE_DIRECTOR` (
  `DIRECTOR_ID` int NOT NULL,
  `SHOW_EPISODE_ID` int NOT NULL,
  PRIMARY KEY (`DIRECTOR_ID`,`SHOW_EPISODE_ID`),
  KEY `FK_SHOW_EPISODE_DIRECTOR_SHOW_EPISODE_ID` (`SHOW_EPISODE_ID`),
  CONSTRAINT `FK_SHOW_EPISODE_DIRECTOR_DIRECTOR_ID` FOREIGN KEY (`DIRECTOR_ID`) REFERENCES `DIRECTOR` (`DIRECTOR_ID`),
  CONSTRAINT `FK_SHOW_EPISODE_DIRECTOR_SHOW_EPISODE_ID` FOREIGN KEY (`SHOW_EPISODE_ID`) REFERENCES `SHOW_EPISODE` (`SHOW_EPISODE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOW_EPISODE_DIRECTOR`
--

LOCK TABLES `SHOW_EPISODE_DIRECTOR` WRITE;
/*!40000 ALTER TABLE `SHOW_EPISODE_DIRECTOR` DISABLE KEYS */;
INSERT INTO `SHOW_EPISODE_DIRECTOR` VALUES (1,11),(1,12),(2,13),(2,14),(3,15),(3,16),(4,17),(4,18),(5,19),(5,20),(6,21),(6,22),(7,23),(7,24),(8,25),(8,26),(9,27),(9,28),(10,29),(10,30),(1,31),(1,32),(1,33),(1,34),(5,35),(5,36),(5,37),(5,38);
/*!40000 ALTER TABLE `SHOW_EPISODE_DIRECTOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SHOW_GENRE`
--

DROP TABLE IF EXISTS `SHOW_GENRE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHOW_GENRE` (
  `SHOW_ID` int NOT NULL,
  `GENRE_ID` int NOT NULL,
  PRIMARY KEY (`SHOW_ID`,`GENRE_ID`),
  KEY `FK_SHOW_GENRE_GENRE_ID` (`GENRE_ID`),
  CONSTRAINT `FK_SHOW_GENRE_GENRE_ID` FOREIGN KEY (`GENRE_ID`) REFERENCES `GENRE` (`GENRE_ID`),
  CONSTRAINT `FK_SHOW_GENRE_SHOW_ID` FOREIGN KEY (`SHOW_ID`) REFERENCES `SHOWS` (`SHOW_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SHOW_GENRE`
--

LOCK TABLES `SHOW_GENRE` WRITE;
/*!40000 ALTER TABLE `SHOW_GENRE` DISABLE KEYS */;
INSERT INTO `SHOW_GENRE` VALUES (1,1),(3,1),(5,1),(7,1),(10,1),(14,1),(22,1),(23,1),(24,1),(1,2),(2,2),(3,2),(5,2),(7,2),(9,2),(14,2),(24,2),(3,3),(4,3),(10,3),(15,3),(16,3),(45,3),(54,3),(56,3),(63,3),(66,3),(67,3),(69,3),(2,4),(4,4),(6,4),(9,4),(10,4),(11,4),(12,4),(13,4),(17,4),(18,4),(19,4),(20,4),(21,4),(23,4),(24,4),(41,4),(42,4),(43,4),(44,4),(45,4),(46,4),(47,4),(48,4),(49,4),(50,4),(51,4),(52,4),(53,4),(54,4),(55,4),(57,4),(58,4),(59,4),(60,4),(61,4),(62,4),(63,4),(64,4),(65,4),(66,4),(68,4),(69,4),(1,5),(2,5),(4,5),(5,5),(7,5),(9,5),(14,5),(22,5),(24,5),(44,5),(67,5),(8,6),(11,6),(12,6),(13,6),(11,7),(12,7),(13,7),(22,7),(44,8),(48,8),(49,8),(1,9),(2,9),(3,9),(5,9),(7,9),(8,9),(9,9),(10,9),(11,9),(12,9),(13,9),(14,9),(22,9),(23,9),(2,10),(3,10),(6,10),(8,10),(17,10),(18,10),(19,10),(23,10),(43,10),(50,10),(51,10),(55,10),(16,12),(17,12),(18,12),(19,12),(21,12),(43,12),(50,12),(68,12),(42,13),(48,14),(52,14),(57,14),(59,14),(60,14),(65,14),(6,15),(53,15),(64,15),(6,16),(20,16),(45,16),(46,16),(52,16),(59,16),(60,16),(62,16),(63,16),(65,16),(10,17),(17,17),(18,17),(19,17),(22,17),(47,17),(51,17),(55,17),(61,17);
/*!40000 ALTER TABLE `SHOW_GENRE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STATUS`
--

DROP TABLE IF EXISTS `STATUS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `STATUS` (
  `STATUS_ID` int NOT NULL AUTO_INCREMENT,
  `STATUS_NAME` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`STATUS_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STATUS`
--

LOCK TABLES `STATUS` WRITE;
/*!40000 ALTER TABLE `STATUS` DISABLE KEYS */;
INSERT INTO `STATUS` VALUES (1,'Ongoing'),(2,'Completed'),(3,'Upcoming'),(4,'Cancelled');
/*!40000 ALTER TABLE `STATUS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SUBMISSION`
--

DROP TABLE IF EXISTS `SUBMISSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SUBMISSION` (
  `SUBMISSION_ID` int NOT NULL AUTO_INCREMENT,
  `PUBLISHER_ID` int DEFAULT NULL,
  `ADMIN_ID` int DEFAULT NULL,
  `LINK_TO_SHOW` varchar(100) DEFAULT NULL,
  `VERDICT` varchar(20) DEFAULT NULL,
  `CREATED_AT` date DEFAULT NULL,
  `UPDATED_AT` date DEFAULT NULL,
  `TYPE` varchar(20) DEFAULT NULL,
  `TITLE` varchar(255) DEFAULT NULL,
  `DESCRIPTION` varchar(1000) DEFAULT NULL,
  `TEASER` varchar(255) DEFAULT NULL,
  `CATEGORY` varchar(100) DEFAULT NULL,
  `BANNER_IMG` varchar(255) DEFAULT NULL,
  `THUMB_IMG` varchar(255) DEFAULT NULL,
  `SHOW_ID` int DEFAULT NULL,
  PRIMARY KEY (`SUBMISSION_ID`),
  KEY `FK_SUBMISSION_ADMIN_ID` (`ADMIN_ID`),
  KEY `FK_SUBMISSION_PUBLISHER_ID` (`PUBLISHER_ID`),
  CONSTRAINT `FK_SUBMISSION_ADMIN_ID` FOREIGN KEY (`ADMIN_ID`) REFERENCES `CONTENT_ADMIN` (`ADMIN_ID`),
  CONSTRAINT `FK_SUBMISSION_PUBLISHER_ID` FOREIGN KEY (`PUBLISHER_ID`) REFERENCES `PUBLISHER` (`PUBLISHER_ID`),
  CONSTRAINT `SUBMISSION_chk_1` CHECK ((`TYPE` in (_utf8mb4'EPISODES',_utf8mb4'SHOWS')))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SUBMISSION`
--

LOCK TABLES `SUBMISSION` WRITE;
/*!40000 ALTER TABLE `SUBMISSION` DISABLE KEYS */;
INSERT INTO `SUBMISSION` VALUES (1,1,5,'https://wb.com/avengers-endgame-submission','PENDING','2025-06-04','2025-07-22','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,2,5,'https://disney.com/barbie-submission','PENDING','2024-09-28','2025-07-22','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,3,5,'https://universal.com/oppenheimer-submission','PENDING','2024-11-17','2025-07-22','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,4,5,'https://paramount.com/deadpool-submission','PENDING','2024-08-13','2025-07-22','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,5,5,'https://sony.com/spiderman-submission','PENDING','2024-11-20','2025-07-22','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,6,5,'https://netflix.com/dune-submission','PENDING','2025-01-10','2025-07-22','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,1,5,'https://wb.com/batman-begins-submission','PENDING','2024-11-29','2025-07-23','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,2,5,'https://disney.com/frozen-3-submission','PENDING','2024-12-04','2025-07-22','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,3,5,'https://universal.com/jurassic-world-submission','PENDING','2025-05-04','2025-07-22','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,4,5,'https://paramount.com/mission-impossible-submission','PENDING','2025-05-12','2025-07-25','SHOWS',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `SUBMISSION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SUBSCRIPTION_TYPE`
--

DROP TABLE IF EXISTS `SUBSCRIPTION_TYPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SUBSCRIPTION_TYPE` (
  `SUBSCRIPTION_TYPE_ID` int NOT NULL AUTO_INCREMENT,
  `PRICE` decimal(10,2) NOT NULL,
  `DESCRIPTION` varchar(500) NOT NULL,
  `DURATION_DAYS` int NOT NULL,
  `IS_ACTIVE` int DEFAULT NULL,
  PRIMARY KEY (`SUBSCRIPTION_TYPE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SUBSCRIPTION_TYPE`
--

LOCK TABLES `SUBSCRIPTION_TYPE` WRITE;
/*!40000 ALTER TABLE `SUBSCRIPTION_TYPE` DISABLE KEYS */;
INSERT INTO `SUBSCRIPTION_TYPE` VALUES (1,9.99,'Basic Plan - SD Quality',30,1),(2,15.99,'Standard Plan - HD Quality',30,1),(3,19.99,'Premium Plan - 4K Quality',30,1),(4,99.99,'Annual Basic Plan',365,1),(5,159.99,'Annual Standard Plan',365,1),(6,199.99,'Annual Premium Plan',365,1);
/*!40000 ALTER TABLE `SUBSCRIPTION_TYPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SUPPORT_ADMIN`
--

DROP TABLE IF EXISTS `SUPPORT_ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SUPPORT_ADMIN` (
  `ADMIN_ID` int NOT NULL,
  PRIMARY KEY (`ADMIN_ID`),
  CONSTRAINT `FK_SUPPORT_ADMIN_ID` FOREIGN KEY (`ADMIN_ID`) REFERENCES `ADMIN` (`ADMIN_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SUPPORT_ADMIN`
--

LOCK TABLES `SUPPORT_ADMIN` WRITE;
/*!40000 ALTER TABLE `SUPPORT_ADMIN` DISABLE KEYS */;
INSERT INTO `SUPPORT_ADMIN` VALUES (3),(6);
/*!40000 ALTER TABLE `SUPPORT_ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TRANSACTION`
--

DROP TABLE IF EXISTS `TRANSACTION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TRANSACTION` (
  `TRANSACTION_ID` int NOT NULL AUTO_INCREMENT,
  `METHOD_ID` int NOT NULL,
  `USER_ID` int NOT NULL,
  `AMOUNT` decimal(10,2) NOT NULL,
  `TRANSACTION_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `TRANSACTION_STATUS` varchar(20) DEFAULT 'PENDING',
  PRIMARY KEY (`TRANSACTION_ID`),
  KEY `FK_TRANSACTION_METHOD_ID` (`METHOD_ID`),
  KEY `FK_TRANSACTION_USER_ID` (`USER_ID`),
  CONSTRAINT `FK_TRANSACTION_METHOD_ID` FOREIGN KEY (`METHOD_ID`) REFERENCES `METHOD` (`METHOD_ID`),
  CONSTRAINT `FK_TRANSACTION_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`),
  CONSTRAINT `CHK_TRANSACTION_AMOUNT` CHECK ((`AMOUNT` > 0)),
  CONSTRAINT `TRANSACTION_chk_1` CHECK ((`TRANSACTION_STATUS` in (_utf8mb4'PENDING',_utf8mb4'COMPLETED',_utf8mb4'FAILED',_utf8mb4'REFUNDED')))
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TRANSACTION`
--

LOCK TABLES `TRANSACTION` WRITE;
/*!40000 ALTER TABLE `TRANSACTION` DISABLE KEYS */;
INSERT INTO `TRANSACTION` VALUES (1,1,1,9.99,'2025-07-20 18:00:00','COMPLETED'),(2,2,2,15.99,'2025-07-21 18:00:00','COMPLETED'),(3,3,3,199.99,'2025-07-19 18:00:00','FAILED'),(4,2,4,99.99,'2025-07-24 18:00:00','COMPLETED'),(5,1,5,159.99,'2025-07-24 18:00:00','REFUNDED'),(6,3,6,9.99,'2025-07-24 18:00:00','COMPLETED'),(7,2,7,15.99,'2025-07-18 18:00:00','PENDING'),(8,1,8,19.99,'2025-07-19 18:00:00','COMPLETED'),(9,3,9,99.99,'2025-07-23 18:00:00','COMPLETED'),(10,2,10,199.99,'2025-07-19 18:00:00','COMPLETED'),(11,1,1,15.99,'2025-07-18 18:00:00','COMPLETED'),(12,2,2,19.99,'2025-07-21 18:00:00','PENDING'),(13,3,3,9.99,'2025-07-21 18:00:00','FAILED'),(14,1,4,199.99,'2025-07-18 18:00:00','COMPLETED'),(15,2,5,15.99,'2025-07-23 18:00:00','COMPLETED'),(16,1,14,9.99,'2025-07-23 18:00:00','COMPLETED'),(23,1,14,9.99,'2025-07-19 18:00:00','COMPLETED'),(24,3,14,9.99,'2025-07-19 18:00:00','COMPLETED'),(25,3,14,5.00,'2025-07-24 18:00:00','COMPLETED'),(26,3,14,5.00,'2025-07-19 18:00:00','COMPLETED'),(27,3,14,5.00,'2025-07-18 18:00:00','COMPLETED'),(28,3,14,5.00,'2025-07-18 18:00:00','COMPLETED'),(29,3,25,5.00,'2025-07-24 18:00:00','COMPLETED'),(30,3,14,11.99,'2025-07-26 05:08:15','COMPLETED'),(31,3,14,9.99,'2025-07-28 17:29:13','COMPLETED'),(32,3,14,9.99,'2025-07-28 17:34:14','COMPLETED'),(33,3,14,9.99,'2025-07-28 17:34:15','COMPLETED'),(34,3,14,199.99,'2025-07-28 18:07:56','COMPLETED'),(35,3,31,9.99,'2025-07-28 18:22:41','COMPLETED'),(36,3,31,9.99,'2025-07-28 18:22:41','COMPLETED'),(37,3,33,199.99,'2025-07-28 18:57:41','COMPLETED'),(38,3,33,199.99,'2025-07-28 18:57:43','COMPLETED'),(39,3,33,199.99,'2025-07-28 18:57:43','COMPLETED'),(40,1,36,199.99,'2025-07-29 04:39:07','COMPLETED'),(41,1,36,199.99,'2025-07-29 04:39:08','COMPLETED');
/*!40000 ALTER TABLE `TRANSACTION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER` (
  `USER_ID` int NOT NULL AUTO_INCREMENT,
  `PERSON_ID` int NOT NULL,
  `COUNTRY_ID` varchar(3) NOT NULL,
  `USER_FIRSTNAME` varchar(50) NOT NULL,
  `USER_LASTNAME` varchar(50) NOT NULL,
  `BIRTH_DATE` date DEFAULT NULL,
  `PROFILE_PICTURE` varchar(255) DEFAULT NULL,
  `PHONE_NO` varchar(20) DEFAULT NULL,
  `JOIN_DATE` date DEFAULT NULL,
  PRIMARY KEY (`USER_ID`),
  KEY `FK_USER_PERSON` (`PERSON_ID`),
  KEY `FK_USER_COUNTRY` (`COUNTRY_ID`),
  CONSTRAINT `FK_USER_COUNTRY` FOREIGN KEY (`COUNTRY_ID`) REFERENCES `COUNTRY` (`COUNTRY_ID`),
  CONSTRAINT `FK_USER_PERSON` FOREIGN KEY (`PERSON_ID`) REFERENCES `PERSON` (`PERSON_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER`
--

LOCK TABLES `USER` WRITE;
/*!40000 ALTER TABLE `USER` DISABLE KEYS */;
INSERT INTO `USER` VALUES (1,101,'USA','John','Doe','1990-05-15',NULL,NULL,'2025-07-23'),(2,102,'UK','Jane','Smith','1985-08-20',NULL,NULL,'2025-07-24'),(3,103,'CAN','Mike','Johnson','1992-12-03',NULL,NULL,'2025-07-20'),(4,104,'AUS','Sarah','Williams','1988-03-25',NULL,NULL,'2025-07-24'),(5,105,'USA','David','Brown','1995-11-10',NULL,NULL,'2025-07-19'),(6,106,'UK','Lisa','Davis','1987-07-18',NULL,NULL,'2025-07-25'),(7,107,'USA','Chris','Wilson','1993-09-22',NULL,NULL,'2025-07-24'),(8,108,'CAN','Anna','Taylor','1991-01-30',NULL,NULL,'2025-07-23'),(9,109,'USA','Robert','Anderson','1989-04-12',NULL,NULL,'2025-07-20'),(10,110,'AUS','Emily','Thomas','1994-06-08',NULL,NULL,'2025-07-24'),(12,111,'BD','check','Saha','2002-04-18',NULL,'null','2025-07-21'),(14,113,'USA','Arnab','Sahaha','1111-11-08','20250308_173435-1753701083933.jpg','null','2025-07-22'),(19,118,'BD','asd','asdad','1212-12-12',NULL,NULL,'2025-07-21'),(24,123,'CAN','sth','srg','0011-11-11',NULL,NULL,'2025-07-22'),(25,124,'GER','zoro','roronoa','1111-11-09','20211120_122759 (1)-1753346520939.jpg','','2025-07-21'),(26,125,'BD','Rafid','Mostafiz','2025-07-29',NULL,NULL,NULL),(27,126,'JPN','asdasd','asdasd','2000-01-01',NULL,NULL,NULL),(28,127,'JPN','asdasd','asdasd','2000-01-01',NULL,NULL,NULL),(29,128,'BD','Tahmid','Khan','2003-01-09',NULL,NULL,NULL),(30,129,'BD','Gqga','Tayay','2025-07-10',NULL,NULL,NULL),(31,130,'BD','nigga','123','2025-07-29',NULL,NULL,NULL),(32,131,'BD','Ana','Bil','2025-07-10',NULL,NULL,NULL),(33,132,'BD','Bishesh ','Roy','2025-06-10',NULL,NULL,NULL),(34,133,'BD','Bishmit','Roy','2010-06-13',NULL,NULL,NULL),(35,134,'BD','Hafizur ','Rahman','2004-03-02',NULL,NULL,NULL),(36,135,'JPN','A','Bc','2025-07-29',NULL,NULL,NULL),(37,136,'KOR','asd','asd','1111-11-11',NULL,NULL,NULL),(38,137,'BD','Aditya','Roy','2005-09-21',NULL,NULL,NULL);
/*!40000 ALTER TABLE `USER` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_after_user_insert` AFTER INSERT ON `USER` FOR EACH ROW BEGIN
  INSERT INTO USER_NOTIFICATIONS (USER_ID, NOTIF_ID, IS_READ)
  VALUES
    (NEW.USER_ID, 5, 0),
    (NEW.USER_ID, 4, 0);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_after_user_insert_preferences` AFTER INSERT ON `USER` FOR EACH ROW BEGIN
  INSERT INTO USER_PREFERENCES (USER_ID, HOVER_TRAILER, SHOW_RATING)
  VALUES (NEW.USER_ID, 1, 1);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `USER_EPISODE`
--

DROP TABLE IF EXISTS `USER_EPISODE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_EPISODE` (
  `USER_ID` int NOT NULL,
  `SHOW_EPISODE_ID` int NOT NULL,
  `WATCHED` int DEFAULT NULL,
  `TIMESTAMP` timestamp NOT NULL,
  PRIMARY KEY (`USER_ID`,`SHOW_EPISODE_ID`,`TIMESTAMP`),
  KEY `FK_USER_EPISODE_SHOW_EPISODE_ID` (`SHOW_EPISODE_ID`),
  CONSTRAINT `FK_USER_EPISODE_SHOW_EPISODE_ID_NEW` FOREIGN KEY (`SHOW_EPISODE_ID`) REFERENCES `SHOW_EPISODE` (`SHOW_EPISODE_ID`),
  CONSTRAINT `FK_USER_EPISODE_USER_ID_NEW` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_EPISODE`
--

LOCK TABLES `USER_EPISODE` WRITE;
/*!40000 ALTER TABLE `USER_EPISODE` DISABLE KEYS */;
INSERT INTO `USER_EPISODE` VALUES (1,1,1,'2025-07-21 00:54:24'),(1,5,1,'2025-07-19 10:36:47'),(1,9,1,'2025-07-24 01:33:35'),(2,2,1,'2025-07-18 15:50:12'),(2,4,1,'2025-07-20 01:00:57'),(2,10,1,'2025-07-22 00:15:05'),(3,3,1,'2025-07-21 12:52:43'),(3,6,1,'2025-07-23 21:55:55'),(4,7,1,'2025-07-22 06:12:16'),(4,8,1,'2025-07-22 01:11:57'),(5,1,1,'2025-07-25 03:36:32'),(5,2,1,'2025-07-22 19:49:42'),(6,4,1,'2025-07-24 01:40:08'),(6,6,1,'2025-07-22 00:28:15'),(7,3,1,'2025-07-22 19:48:36'),(7,5,1,'2025-07-21 02:04:04'),(8,8,1,'2025-07-24 16:06:38'),(8,10,1,'2025-07-23 08:45:42'),(9,7,1,'2025-07-24 22:28:33'),(9,9,1,'2025-07-19 04:13:36'),(10,1,1,'2025-07-18 20:49:24'),(10,4,1,'2025-07-20 17:12:56'),(14,1,1,'2025-07-20 14:48:03'),(14,1,1,'2025-07-22 02:31:15'),(14,1,1,'2025-07-23 10:57:19'),(14,1,1,'2025-07-23 14:06:47'),(14,1,1,'2025-07-26 05:06:15'),(14,2,1,'2025-07-21 23:01:08'),(14,2,1,'2025-07-25 14:40:24'),(14,5,1,'2025-07-20 23:13:11'),(14,6,1,'2025-07-18 22:17:37'),(14,7,1,'2025-07-25 07:07:49'),(14,10,1,'2025-07-22 02:49:48'),(14,13,1,'2025-07-26 06:36:06'),(33,1,1,'2025-07-28 18:58:24'),(36,1,1,'2025-07-29 04:40:30');
/*!40000 ALTER TABLE `USER_EPISODE` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_increment_watch_count` AFTER INSERT ON `USER_EPISODE` FOR EACH ROW BEGIN
  DECLARE v_show_id INT;

  -- Get the SHOW_ID from the inserted SHOW_EPISODE_ID
  SELECT SHOW_ID INTO v_show_id
  FROM SHOW_EPISODE
  WHERE SHOW_EPISODE_ID = NEW.SHOW_EPISODE_ID;

  -- Increment the WATCH_COUNT of the corresponding SHOW
  UPDATE SHOWS
  SET WATCH_COUNT = IFNULL(WATCH_COUNT, 0) + 1
  WHERE SHOW_ID = v_show_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `USER_NOTIFICATIONS`
--

DROP TABLE IF EXISTS `USER_NOTIFICATIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_NOTIFICATIONS` (
  `USER_ID` bigint NOT NULL,
  `NOTIF_ID` bigint NOT NULL,
  `IS_READ` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`USER_ID`,`NOTIF_ID`),
  KEY `NOTIF_ID` (`NOTIF_ID`),
  CONSTRAINT `USER_NOTIFICATIONS_ibfk_1` FOREIGN KEY (`NOTIF_ID`) REFERENCES `NOTIFICATIONS` (`NOTIF_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_NOTIFICATIONS`
--

LOCK TABLES `USER_NOTIFICATIONS` WRITE;
/*!40000 ALTER TABLE `USER_NOTIFICATIONS` DISABLE KEYS */;
INSERT INTO `USER_NOTIFICATIONS` VALUES (1,15,0),(1,16,0),(1,17,0),(2,15,0),(2,16,0),(2,17,0),(3,15,0),(3,16,0),(3,17,0),(4,15,0),(4,16,0),(4,17,0),(5,15,0),(5,16,0),(5,17,0),(6,15,0),(6,16,0),(6,17,0),(7,15,0),(7,16,0),(7,17,0),(8,15,0),(8,16,0),(8,17,0),(9,15,0),(9,16,0),(9,17,0),(10,15,0),(10,16,0),(10,17,0),(12,15,1),(12,16,1),(12,17,1),(12,21,1),(12,23,1),(14,4,1),(14,6,1),(14,7,1),(14,8,1),(14,9,1),(14,10,1),(14,15,1),(14,16,1),(14,17,1),(14,18,1),(14,19,1),(14,20,1),(14,22,1),(14,25,1),(14,26,1),(19,15,0),(19,16,0),(19,17,0),(21,4,1),(21,5,1),(24,4,1),(24,5,1),(25,4,1),(25,5,1),(25,24,1),(26,4,0),(26,5,0),(27,4,0),(27,5,0),(28,4,1),(28,5,1),(28,27,0),(28,29,0),(29,4,0),(29,5,0),(30,4,0),(30,5,0),(31,4,1),(31,5,1),(31,28,0),(32,4,0),(32,5,0),(33,4,0),(33,5,1),(33,30,0),(34,4,1),(34,5,1),(35,4,1),(35,5,1),(36,4,0),(36,5,0),(37,4,0),(37,5,1),(38,4,0),(38,5,0);
/*!40000 ALTER TABLE `USER_NOTIFICATIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_PREFERENCES`
--

DROP TABLE IF EXISTS `USER_PREFERENCES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_PREFERENCES` (
  `USER_ID` int NOT NULL,
  `HOVER_TRAILER` int NOT NULL DEFAULT '1',
  `SHOW_RATING` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`USER_ID`),
  CONSTRAINT `FK_USER_PREFERENCES_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE,
  CONSTRAINT `USER_PREFERENCES_chk_1` CHECK ((`HOVER_TRAILER` in (0,1))),
  CONSTRAINT `USER_PREFERENCES_chk_2` CHECK ((`SHOW_RATING` in (0,1)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_PREFERENCES`
--

LOCK TABLES `USER_PREFERENCES` WRITE;
/*!40000 ALTER TABLE `USER_PREFERENCES` DISABLE KEYS */;
INSERT INTO `USER_PREFERENCES` VALUES (1,1,1),(2,1,1),(3,1,1),(4,1,1),(5,1,1),(6,1,1),(7,1,1),(8,1,1),(9,1,1),(10,1,1),(12,1,1),(14,1,1),(19,1,1),(24,1,1),(25,1,1),(26,1,1),(27,1,1),(28,1,1),(29,1,1),(30,1,1),(31,1,1),(32,1,1),(33,1,1),(34,1,1),(35,1,1),(36,1,1),(37,1,1),(38,1,1);
/*!40000 ALTER TABLE `USER_PREFERENCES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_PROMOTION_USAGE`
--

DROP TABLE IF EXISTS `USER_PROMOTION_USAGE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_PROMOTION_USAGE` (
  `USER_ID` int NOT NULL,
  `PROMOTION_ID` int NOT NULL,
  `USAGE_DATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ID`,`PROMOTION_ID`),
  KEY `FK_UPU_PROMOTION_ID` (`PROMOTION_ID`),
  CONSTRAINT `FK_UPU_PROMOTION_ID` FOREIGN KEY (`PROMOTION_ID`) REFERENCES `PROMOTION` (`PROMOTION_ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_UPU_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_PROMOTION_USAGE`
--

LOCK TABLES `USER_PROMOTION_USAGE` WRITE;
/*!40000 ALTER TABLE `USER_PROMOTION_USAGE` DISABLE KEYS */;
INSERT INTO `USER_PROMOTION_USAGE` VALUES (14,1,'2025-07-24 08:02:28'),(14,2,'2025-07-26 05:08:17'),(25,1,'2025-07-24 09:10:16');
/*!40000 ALTER TABLE `USER_PROMOTION_USAGE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER_SUBSCRIPTION`
--

DROP TABLE IF EXISTS `USER_SUBSCRIPTION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_SUBSCRIPTION` (
  `USER_ID` int NOT NULL,
  `TRANSACTION_ID` int NOT NULL,
  `SUBSCRIPTION_TYPE_ID` int NOT NULL,
  `START_DATE` date NOT NULL,
  `END_DATE` date NOT NULL,
  `SUBSCRIPTION_STATUS` int DEFAULT NULL,
  PRIMARY KEY (`USER_ID`,`TRANSACTION_ID`),
  KEY `FK_USER_SUBSCRIPTION_SUBSCRIPTION_TYPE_ID` (`SUBSCRIPTION_TYPE_ID`),
  KEY `FK_USER_SUBSCRIPTION_TRANSACTION_ID` (`TRANSACTION_ID`),
  CONSTRAINT `FK_USER_SUBSCRIPTION_SUBSCRIPTION_TYPE_ID` FOREIGN KEY (`SUBSCRIPTION_TYPE_ID`) REFERENCES `SUBSCRIPTION_TYPE` (`SUBSCRIPTION_TYPE_ID`),
  CONSTRAINT `FK_USER_SUBSCRIPTION_TRANSACTION_ID` FOREIGN KEY (`TRANSACTION_ID`) REFERENCES `TRANSACTION` (`TRANSACTION_ID`),
  CONSTRAINT `FK_USER_SUBSCRIPTION_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USER` (`USER_ID`),
  CONSTRAINT `CHK_SUBSCRIPTION_DATES` CHECK ((`END_DATE` > `START_DATE`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER_SUBSCRIPTION`
--

LOCK TABLES `USER_SUBSCRIPTION` WRITE;
/*!40000 ALTER TABLE `USER_SUBSCRIPTION` DISABLE KEYS */;
INSERT INTO `USER_SUBSCRIPTION` VALUES (1,1,1,'2024-12-01','2025-12-01',1),(2,2,2,'2025-01-15','2025-02-14',0),(3,4,4,'2025-04-05','2026-04-05',1),(4,6,3,'2025-05-24','2025-06-23',0),(5,10,5,'2025-06-27','2026-06-27',1),(14,28,1,'2025-07-24','2025-08-23',0),(14,30,2,'2025-07-26','2025-08-25',0),(14,31,1,'2025-07-28','2025-08-27',0),(14,32,1,'2025-07-28','2025-08-27',1),(14,33,1,'2025-07-28','2025-08-27',1),(14,34,6,'2025-07-28','2026-07-28',1),(25,29,1,'2025-07-24','2025-08-23',0),(31,35,1,'2025-07-28','2025-08-27',1),(31,36,1,'2025-07-28','2025-08-27',1),(33,37,6,'2025-07-28','2026-07-28',1),(33,38,6,'2025-07-28','2026-07-28',1),(33,39,6,'2025-07-28','2026-07-28',1),(36,40,6,'2025-07-29','2026-07-29',1),(36,41,6,'2025-07-29','2026-07-29',1);
/*!40000 ALTER TABLE `USER_SUBSCRIPTION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VIOLATION`
--

DROP TABLE IF EXISTS `VIOLATION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VIOLATION` (
  `VIOLATION_ID` int NOT NULL AUTO_INCREMENT,
  `VIOLATION_TEXT` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`VIOLATION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VIOLATION`
--

LOCK TABLES `VIOLATION` WRITE;
/*!40000 ALTER TABLE `VIOLATION` DISABLE KEYS */;
INSERT INTO `VIOLATION` VALUES (1,'Spam'),(2,'Harassment'),(3,'Hate Speech'),(4,'Violence'),(5,'Adult Content'),(6,'Copyright'),(7,'Misinformation'),(8,'Profanity'),(9,'Off Topic'),(10,'Personal Info');
/*!40000 ALTER TABLE `VIOLATION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'railway'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `deactivate_expired_publishers` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`%`*/ /*!50106 EVENT `deactivate_expired_publishers` ON SCHEDULE EVERY 1 DAY STARTS '2025-07-25 20:08:38' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE PUBLISHER
          SET IS_ACTIVE = 0
          WHERE IS_ACTIVE != 0
            AND DATE_ADD(CONTRACT_DATE, INTERVAL CONTRACT_DURATION_DAYS DAY) < CURDATE() */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `expire_subscriptions` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`root`@`%`*/ /*!50106 EVENT `expire_subscriptions` ON SCHEDULE EVERY 1 DAY STARTS '2025-07-24 11:14:38' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE USER_SUBSCRIPTION
          SET SUBSCRIPTION_STATUS = 0
          WHERE END_DATE < CURDATE() AND SUBSCRIPTION_STATUS = 1 */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'railway'
--
/*!50003 DROP PROCEDURE IF EXISTS `AddComment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddComment`(
  IN p_user_id INT,
  IN p_episode_id INT,
  IN p_text VARCHAR(500),
  IN p_parent_id INT,
  IN p_img_link VARCHAR(100)
)
BEGIN
  INSERT INTO COMMENT (
    USER_ID, SHOW_EPISODE_ID, TEXT, PARENT_ID, TIME, IMG_LINK,
    LIKE_COUNT, DISLIKE_COUNT, DELETED, EDITED, PINNED
  )
  VALUES (
    p_user_id, p_episode_id, p_text, p_parent_id, NOW(), p_img_link,
    0, 0, 0, 0, 0
  );
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteParentAndChildren` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteParentAndChildren`(IN parentId INT)
BEGIN
  -- Delete all children
  DELETE FROM COMMENT
  WHERE PARENT_ID = parentId;

  -- Delete the parent itself
  DELETE FROM COMMENT
  WHERE COMMENT_ID = parentId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetIncomeForDays` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `GetIncomeForDays`(IN daysCount INT)
BEGIN
        IF daysCount NOT IN (7, 30) THEN
          SET daysCount = 7;
        END IF;
        WITH RECURSIVE date_range AS (
          SELECT CURDATE() - INTERVAL daysCount DAY AS day
          UNION ALL
          SELECT day + INTERVAL 1 DAY
          FROM date_range
          WHERE day + INTERVAL 1 DAY <= CURDATE() - INTERVAL 1 DAY
        )
        SELECT 
          dr.day AS transaction_day,
          COALESCE(SUM(t.AMOUNT), 0) AS daily_income
        FROM date_range dr
        LEFT JOIN `TRANSACTION` t 
          ON DATE(t.TRANSACTION_DATE) = dr.day
          AND t.TRANSACTION_STATUS = 'COMPLETED'
        GROUP BY dr.day
        ORDER BY dr.day;
      END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetPublisherEarningsForPeriod` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `GetPublisherEarningsForPeriod`(
        IN p_publisher_id INT,
        IN p_days_back INT
      )
BEGIN
        WITH RECURSIVE dates AS (
          SELECT CURDATE() - INTERVAL 1 DAY AS dt
          UNION ALL
          SELECT dt - INTERVAL 1 DAY FROM dates WHERE dt > CURDATE() - INTERVAL p_days_back DAY
        )
        SELECT 
          d.dt AS `date`,
          COALESCE(SUM(CASE WHEN pe.EARNING_TYPE = 'ROYALTY' THEN pe.AMOUNT ELSE 0 END), 0) AS royalty,
          COALESCE(MIN(pe_min.AMOUNT), 0) AS min_guarantee,
          COALESCE(SUM(CASE WHEN pe.EARNING_TYPE = 'ROYALTY' THEN pe.AMOUNT ELSE 0 END), 0) + COALESCE(MIN(pe_min.AMOUNT), 0) AS total
        FROM dates d
        LEFT JOIN PUBLISHER_EARNINGS pe
          ON pe.PUBLISHER_ID = p_publisher_id
          AND pe.EARNING_TYPE = 'ROYALTY'
          AND pe.PAID_DATE = d.dt
        LEFT JOIN PUBLISHER_EARNINGS pe_min
          ON pe_min.PUBLISHER_ID = p_publisher_id
          AND pe_min.EARNING_TYPE = 'MINIMUM_GUARANTEE'
          AND pe_min.PAID_DATE = d.dt
        GROUP BY d.dt
        ORDER BY d.dt ASC;
      END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserJoinStats` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserJoinStats`(IN days_back INT)
BEGIN
  WITH RECURSIVE date_range AS (
    SELECT CURDATE() - INTERVAL (days_back + 1) DAY AS d
    UNION ALL
    SELECT d + INTERVAL 1 DAY
    FROM date_range
    WHERE d + INTERVAL 1 DAY <= CURDATE() - INTERVAL 1 DAY
  ),
  daily_counts AS (
    SELECT 
      d AS join_date,
      COUNT(u.USER_ID) AS new_users
    FROM date_range d
    LEFT JOIN USER u ON u.JOIN_DATE = d
    GROUP BY d
  )
  SELECT 
    join_date,
    new_users,
    SUM(new_users) OVER (ORDER BY join_date) AS cumulative_users
  FROM daily_counts;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ToggleDislike` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ToggleDislike`(IN p_comment_id INT, IN p_user_id INT)
BEGIN
  DECLARE existing ENUM('LIKE', 'DISLIKE');

  SELECT REACTION_TYPE INTO existing
  FROM COMMENT_REACTION
  WHERE COMMENT_ID = p_comment_id AND USER_ID = p_user_id;

  IF existing IS NULL THEN
    INSERT INTO COMMENT_REACTION VALUES (p_comment_id, p_user_id, 'DISLIKE');
    UPDATE COMMENT SET DISLIKE_COUNT = DISLIKE_COUNT + 1 WHERE COMMENT_ID = p_comment_id;
  ELSEIF existing = 'LIKE' THEN
    UPDATE COMMENT_REACTION SET REACTION_TYPE = 'DISLIKE' WHERE COMMENT_ID = p_comment_id AND USER_ID = p_user_id;
    UPDATE COMMENT SET DISLIKE_COUNT = DISLIKE_COUNT + 1, LIKE_COUNT = LIKE_COUNT - 1 WHERE COMMENT_ID = p_comment_id;
  ELSE
    DELETE FROM COMMENT_REACTION WHERE COMMENT_ID = p_comment_id AND USER_ID = p_user_id;
    UPDATE COMMENT SET DISLIKE_COUNT = DISLIKE_COUNT - 1 WHERE COMMENT_ID = p_comment_id;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ToggleLike` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `ToggleLike`(IN p_comment_id INT, IN p_user_id INT)
BEGIN
  DECLARE existing ENUM('LIKE', 'DISLIKE');

  SELECT REACTION_TYPE INTO existing
  FROM COMMENT_REACTION
  WHERE COMMENT_ID = p_comment_id AND USER_ID = p_user_id;

  IF existing IS NULL THEN
    INSERT INTO COMMENT_REACTION VALUES (p_comment_id, p_user_id, 'LIKE');
    UPDATE COMMENT SET LIKE_COUNT = LIKE_COUNT + 1 WHERE COMMENT_ID = p_comment_id;
  ELSEIF existing = 'DISLIKE' THEN
    UPDATE COMMENT_REACTION SET REACTION_TYPE = 'LIKE' WHERE COMMENT_ID = p_comment_id AND USER_ID = p_user_id;
    UPDATE COMMENT SET LIKE_COUNT = LIKE_COUNT + 1, DISLIKE_COUNT = DISLIKE_COUNT - 1 WHERE COMMENT_ID = p_comment_id;
  ELSE
    DELETE FROM COMMENT_REACTION WHERE COMMENT_ID = p_comment_id AND USER_ID = p_user_id;
    UPDATE COMMENT SET LIKE_COUNT = LIKE_COUNT - 1 WHERE COMMENT_ID = p_comment_id;
  END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-30  0:42:15
