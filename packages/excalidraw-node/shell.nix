{ pkgs ? import <nixpkgs> { } }:
with pkgs; mkShell {
  name = "node-dev-shell";
  buildInputs = [ nodejs-14_x yarn ];
  LD_LIBRARY_PATH = "${libuuid.out}/lib";
}
