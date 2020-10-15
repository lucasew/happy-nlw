with import <nixpkgs> {};
stdenv.mkDerivation {
  name = "nlw3-environment";
  shellHook = ''
    PATH=$PATH:$(yarn global bin)
    echo "Se o expo não estiver instalado execute o comando yarn global add expo-cli"
  '';
  buildInputs = with pkgs; [
    nodejs
    yarn
  ];
}
