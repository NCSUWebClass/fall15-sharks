#!/usr/bin/env bash
# INTENDED ONLY FOR CENTOS 7 10.0 (64-BIT)
# Requires sudo permissions and user interaction
# Purely for setting up and securing the latest MariaDB software
# Assumes MariaDB has never been run or configured before

REPO_CONTENTS = "[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.0/centos7-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1"

sudo yum remove mariadb-server mariadb-libs mariadb-client
sudo echo $REPO_CONTENTS > /etc/yum.repos.d/MariaDB.repo
sudo yum install MariaDB-server MariaDB-client
sudo systemctl start mysql
sudo mysql_upgrade
sudo mysql_secure_installation
echo "Please configure users manually by connecting to MariaDB"