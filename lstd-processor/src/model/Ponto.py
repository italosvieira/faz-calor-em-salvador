class Ponto:
    def __init__(self, latitude, longitude):
        self.latitude = latitude
        self.longitude = longitude

    @property
    def latitude(self):
        return self.latitude

    @property
    def longitude(self):
        return self.longitude
