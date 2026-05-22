from whitenoise.storage import CompressedManifestStaticFilesStorage

class IgnoreMissingManifestStaticFilesStorage(CompressedManifestStaticFilesStorage):
    def hashed_name(self, name, content=None, filename=None):
        try:
            return super().hashed_name(name, content, filename)
        except ValueError:
            return name

class CustomManifestStaticFilesStorage(CompressedManifestStaticFilesStorage):
    """
    Storage qui évite l'erreur "MissingFileError" lors de la collecte.
    Se produit quand un fichier listé dans le manifest n'a pas été trouvé.
    """
    
    def hashed_name(self, name, content=None, filename=None):
        """On surcharge hashed_name pour intercepter l'erreur de fichier manquant."""
        try:
            # On essaie de générer le nom haché comme d'habitude
            return super().hashed_name(name, content, filename)
        except ValueError:
            # Si le fichier n'est pas trouvé, on retourne le nom original
            # Le fichier ne sera pas servi, mais ça évite de casser la collecte
            return name

    def post_process(self, paths, allowed_extensions=None, *args, **kwargs):
        """
        On surcharge post_process pour nettoyer les erreurs de fichiers manquants.
        """
        # Appel normal du traitement post-collecte
        found_files, errors = super().post_process(paths, allowed_extensions, *args, **kwargs)
        
        # On filtre les erreurs pour retirer celles liées aux fichiers manquants
        # L'erreur "MissingFileError" se trouve dans le tuple (nom_fichier, message_erreur)
        filtered_errors = [e for e in errors if "MissingFileError" not in str(e[1])]
        
        # Retourne les fichiers trouvés et les erreurs filtrées
        return found_files, filtered_errors