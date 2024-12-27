with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "fornova";
  buildInputs = [ nodejs ];
}
