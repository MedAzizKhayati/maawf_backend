resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  enable_dns_hostnames = true

  tags = {
    Name = "main"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "igw"
  }
}

resource "aws_subnet" "private-eu-central-1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.0.0/19"
  availability_zone = "eu-central-1a"

  tags = {
    "Name"                                      = "private-eu-central-1a"
    "kubernetes.io/role/internal-elb"           = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

resource "aws_subnet" "private-eu-central-1b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.32.0/19"
  availability_zone = "eu-central-1b"

  tags = {
    "Name"                                      = "private-eu-central-1b"
    "kubernetes.io/role/internal-elb"           = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

resource "aws_subnet" "public-eu-central-1a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.64.0/19"
  availability_zone       = "eu-central-1a"
  map_public_ip_on_launch = true

  tags = {
    "Name"                                      = "public-eu-central-1a"
    "kubernetes.io/role/elb"                    = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

resource "aws_subnet" "public-eu-central-1b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.96.0/19"
  availability_zone       = "eu-central-1b"
  map_public_ip_on_launch = true

  tags = {
    "Name"                                      = "public-eu-central-1b"
    "kubernetes.io/role/elb"                    = "1"
    "kubernetes.io/cluster/${var.cluster_name}" = "owned"
  }
}

resource "aws_nat_gateway" "nat" {
  subnet_id     = aws_subnet.public-eu-central-1a.id

  tags = {
    Name = "nat"
  }

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "private"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public"
  }
}

resource "aws_route_table_association" "private-eu-central-1a" {
  subnet_id      = aws_subnet.private-eu-central-1a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private-eu-central-1b" {
  subnet_id      = aws_subnet.private-eu-central-1b.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "public-eu-central-1a" {
  subnet_id      = aws_subnet.public-eu-central-1a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public-eu-central-1b" {
  subnet_id      = aws_subnet.public-eu-central-1b.id
  route_table_id = aws_route_table.public.id
}