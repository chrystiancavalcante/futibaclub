-- MySQL Script generated by MySQL Workbench
-- Mon Feb 12 17:56:43 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema heroku_da351e278e4b625
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema heroku_da351e278e4b625
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `heroku_da351e278e4b625` DEFAULT CHARACTER SET utf8 ;
USE `heroku_da351e278e4b625` ;

-- -----------------------------------------------------
-- Table `heroku_da351e278e4b625`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_da351e278e4b625`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(245) NULL,
  `email` VARCHAR(245) NULL,
  `passwd` VARCHAR(245) NULL,
  `role` VARCHAR(245) NULL,
  `user_score` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `heroku_da351e278e4b625`.`groups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_da351e278e4b625`.`groups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(245) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `heroku_da351e278e4b625`.`groups_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_da351e278e4b625`.`groups_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `group_id` INT NOT NULL,
  `role` VARCHAR(245) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_groups_users_users_idx` (`user_id` ASC),
  INDEX `fk_groups_users_groups1_idx` (`group_id` ASC),
  CONSTRAINT `fk_groups_users_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `heroku_da351e278e4b625`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_groups_users_groups1`
    FOREIGN KEY (`group_id`)
    REFERENCES `heroku_da351e278e4b625`.`groups` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `heroku_da351e278e4b625`.`games`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_da351e278e4b625`.`games` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `team_a` VARCHAR(245) NULL,
  `team_b` VARCHAR(245) NULL,
  `result_a` INT NULL,
  `result_b` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `heroku_da351e278e4b625`.`guessings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_da351e278e4b625`.`guessings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `result_a` INT NULL,
  `result_b` INT NULL,
  `score` INT NULL,
  `game_id` INT NOT NULL,
  `groups_user_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_guessings_games1_idx` (`game_id` ASC),
  INDEX `fk_guessings_groups_users1_idx` (`groups_user_id` ASC),
  INDEX `fk_guessings_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_guessings_games1`
    FOREIGN KEY (`game_id`)
    REFERENCES `heroku_da351e278e4b625`.`games` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_guessings_groups_users1`
    FOREIGN KEY (`groups_user_id`)
    REFERENCES `heroku_da351e278e4b625`.`groups_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_guessings_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `heroku_da351e278e4b625`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `heroku_da351e278e4b625`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `heroku_da351e278e4b625`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `comment` TEXT NOT NULL,
  `guessing_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comments_guessings1_idx` (`guessing_id` ASC),
  INDEX `fk_comments_users1_idx` (`user_id` ASC),
  CONSTRAINT `fk_comments_guessings1`
    FOREIGN KEY (`guessing_id`)
    REFERENCES `heroku_da351e278e4b625`.`guessings` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comments_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `heroku_da351e278e4b625`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
